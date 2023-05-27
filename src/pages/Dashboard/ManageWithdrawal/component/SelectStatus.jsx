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
    '&.active .MuiInputBase-input': {
        backgroundColor: theme.palette.primary.main,
    },
    '&.inactive .MuiInputBase-input': {
        backgroundColor: theme.palette.warning.main,
    },
    '&.lock .MuiInputBase-input': {
        backgroundColor: theme.palette.grey[700],
    },
    '&.deleted .MuiInputBase-input': {
        backgroundColor: theme.palette.error.main,
    },

}));
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
function SelectStatus({ status ,transactionId}) {
    const [openDialog, setOpenDialog] = useState(false)
    const [newStatus, setNewStatus] = useState(status)

    const handleClose = () => {
        setNewStatus(status)
        setOpenDialog(false)
    }
    const handleChangeStatus = (e) => {
        if (e.target.value !== newStatus) {
            setOpenDialog(true)
            setNewStatus(e.target.value)
        }
    }
    const handleChangeStatusUser = () => {
        let idToast = toast.loading('Đang cập nhật')
        apiAdmin.updateStatusTransaction({ transactionId, isTransferred:newStatus})
            .then(res => {
                toast.update(idToast, { render: 'Cập nhật thành công', isLoading: false, type: 'success', autoClose: 1200 })
            })
            .catch(res => {
                toast.update(idToast, { render: 'Cập nhật thất bại', isLoading: false, type: 'warning', autoClose: 1200 })
                setNewStatus(newStatus)
            })
            .finally(() => setOpenDialog(false))
    }
    return (
        <>
            <Select
                value={newStatus}
                onChange={handleChangeStatus}
                input={<BootstrapInput className={newStatus} />}
            >
                <MenuItem value={true}>Đã chuyển</MenuItem>
                <MenuItem value={false}>Chưa chuyển</MenuItem>
            </Select>
            {
                openDialog &&
                <Dialog
                    open={openDialog}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                >
                    <DialogTitle>{"Thay đổi trạng thái tài khoản"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Bạn có chắn chắn thay đổi trạng thái của thanh toán này không?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Huỷ</Button>
                        <Button onClick={handleChangeStatusUser}>Thay đổi</Button>
                    </DialogActions>
                </Dialog>
            }
        </>
    )
}

export default SelectStatus