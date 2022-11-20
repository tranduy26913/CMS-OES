import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputBase, MenuItem, Select, Slide, styled } from '@mui/material'
import apiAdmin from 'apis/apiAdmin';
import React, { forwardRef, useState } from 'react'
import { toast } from 'react-toastify';


const BootstrapInput = styled(InputBase)(({ theme }) => ({

    '& .MuiInputBase-input': {
        borderRadius: 10,
        position: 'relative',
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        fontSize: 14,
        padding: '4px 0px 4px 8px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
    },
    '& .MuiSvgIcon-root': {
        color: theme.palette.primary.contrastText
    },
    
    '&.premium .MuiInputBase-input': {
        backgroundColor: theme.palette.warning.dark,
    },
}));
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function SelectUpgrade({ id, premium }) {
    const [openDialog, setOpenDialog] = useState(false)
    const [newPremium, setNewPremium] = useState(premium)
    const handleClose = () => {
        setNewPremium(premium)
        setOpenDialog(false)
    }
    const handleChangePremium = (e) => {
        if (e.target.value !== newPremium) {
            setOpenDialog(true)
            setNewPremium(e.target.value)
        }
    }
    const handleChangePremiumUser = () => {
        let idToast = toast.loading('Đang cập nhật')
        apiAdmin.updatePremiumUser({ newPremium })
            .then(res => {
                toast.update(idToast, { render: 'Cập nhật thành công', isLoading: false, type: 'success', autoClose: 1200 })
            })
            .catch(res => {
                toast.update(idToast, { render: 'Cập nhật thất bại', isLoading: false, type: 'warning', autoClose: 1200 })
                setNewPremium(premium)
            })
            .finally(() => setOpenDialog(false))
    }
    return (
        <>
            <Select
                value={newPremium}
                onChange={handleChangePremium}
                input={<BootstrapInput className={newPremium?'premium':''}/>}
            >

                <MenuItem value={true}>Premium</MenuItem>
                <MenuItem value={false}>Free</MenuItem>
            </Select>
            {
                openDialog &&
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Thay đổi cấp độ tài khoản"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Bạn có chắn chắn thay đổi cấp độ của người dùng này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Huỷ</Button>
                        <Button onClick={handleChangePremiumUser}>Thay đổi</Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}

export default SelectUpgrade