import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { logoutSuccess } from 'slices/authSlice'
import { toast } from 'react-toastify'
import jwt_decode from 'jwt-decode'
import apiProfile from 'apis/apiProfile'
import { clearUserInfo, setUserInfo } from 'slices/userSlice'
import { useState } from 'react'
import LoadingPage from 'components/LoadingPage'

const privatePath = [
    '/my/', '/admin/', '/payment', '/course/'
]

function CheckAuthentication(props) {
    const user = useSelector(state => state.user.info)
    const refreshToken = useSelector(state => state.auth.refreshToken)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    useEffect(() => {
        const check = () => {
            const isPrivate = location.pathname !== '/login' ? true : false
            if (isPrivate) {
                setLoading(true)
            }
            if (refreshToken) {
                const tokenDecode = jwt_decode(refreshToken)
                let date = new Date();
                if (tokenDecode.exp < date.getTime() / 1000) {
                    toast.warning("Phiên làm việc của bạn đã hết. Vui lòng đăng nhập lại")
                    dispatch(logoutSuccess())
                    if (isPrivate)
                        navigate('/login')
                }
                if (!user) {
                    apiProfile.getUserInfo()
                        .then(res => {
                            dispatch(setUserInfo(res))
                        })
                        .catch(err => {
                            dispatch(logoutSuccess())
                            if (isPrivate)
                                navigate('/login')
                        })
                        .finally(() => setLoading(false))

                }
                else {
                    setLoading(false)
                }
            }
            else {
                setLoading(false)
                dispatch(clearUserInfo())
                if (isPrivate) {
                    //toast.warning("Bạn không có quyền truy cập. Vui lòng đăng nhập lại")
                    navigate('/login')
                }
            }
        }
        check()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refreshToken])
    return (
        <>
            {
                loading ? <>
                    <LoadingPage content='Đang tải dữ liệu...' />
                    {/* <Typography>Đang lấy thông tin người dùng. Vui lòng đợi</Typography> */}
                </>
                    : props.children
            }
        </>
    )
}

export default CheckAuthentication