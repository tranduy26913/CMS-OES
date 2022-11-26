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
    '&.TEACHER .MuiInputBase-input': {
        backgroundColor: theme.palette.primary.main,
    },
    '&.STUDENT .MuiInputBase-input': {
        backgroundColor: theme.palette.success.main,
    },
    '&.ADMIN .MuiInputBase-input': {
        backgroundColor: theme.palette.warning.dark,
    },
}));
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function SelectRole({ username, role }) {
    const [openDialog, setOpenDialog] = useState(false)
    const [newRole, setNewRole] = useState(role)
    const handleOpen = () => setOpenDialog(true)
    const handleClose = () => {
        setNewRole(role)
        setOpenDialog(false)
    }
    const handleChangeRole = (e) => {
        if (e.target.value !== newRole) {
            setOpenDialog(true)
            setNewRole(e.target.value)
        }
    }
    const handleChangeRoleUser = () => {
        let idToast = toast.loading('Đang cập nhật')
        apiAdmin.updateRoleUser({username, role:newRole })
            .then(res => {
                toast.update(idToast, { render: 'Cập nhật thành công', isLoading: false, type: 'success', autoClose: 1200 })
            })
            .catch(res => {
                toast.update(idToast, { render: 'Cập nhật thất bại', isLoading: false, type: 'warning', autoClose: 1200 })
                setNewRole(role)
            })
            .finally(() => setOpenDialog(false))
    }
    return (
        <>
            <Select
                value={newRole}
                onChange={handleChangeRole}
                input={<BootstrapInput className={newRole} />}
            >
                <MenuItem value={'TEACHER'}>Giáo viên</MenuItem>
                <MenuItem value={'STUDENT'}>Học viên</MenuItem>
                <MenuItem value={'ADMIN'}>Admin</MenuItem>
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
                    <DialogTitle>{"Xoá học viên khỏi hệ thống?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Bạn có chắn chắn thay đổi quyền của người dùng này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Huỷ</Button>
                        <Button onClick={handleChangeRoleUser}>Thay đổi</Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}

export default SelectRole