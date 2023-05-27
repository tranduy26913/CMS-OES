import { forwardRef, useRef, useState } from 'react';
// material
import {
  IconButton,
  Tooltip,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Slide
} from '@mui/material';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import apiAdmin from 'apis/apiAdmin';
import { toast } from 'react-toastify';
// ----------------------------------------------------------------------
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function UserMoreMenu({ id, status, premium }) {

  const [openDialog, setOpenDialog] = useState(false);
  const [dialogUnlock, setDialogUnlock] = useState(false);
  const [dialogUpgrade, setDialogUpgrade] = useState(false);


  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleCloseUnlock = () => {
    setDialogUnlock(false)
  }
  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleDeleteUser = () => {
    const idToast = toast.loading('Đang xoá...')
    setOpenDialog(false)
    apiAdmin.deleteUser({
      id
    })
      .then(res => {
        toast.update(idToast, { render: 'Xoá thành công', autoClose: 1200 })
      })
      .catch(err => {
        toast.update(idToast, { render: 'Xoá không thành công', autoClose: 1200 })
      })
  }
  const handleUnlockUser = () => {
    setDialogUnlock(false)
    const idToast = toast.loading('Đang mở khoá...')
    apiAdmin.deleteUser({
      id
    })
      .then(res => {
        toast.update(idToast, { render: 'Mở khoá thành công', autoClose: 1200 })
      })
      .catch(err => {
        toast.update(idToast, { render: 'Mở khoá không thành công', autoClose: 1200 })
      })
  }
  const handleLockUser = () => {
    setDialogUnlock(false)
    const idToast = toast.loading('Đang khoá...')
    apiAdmin.deleteUser({
      id
    })
      .then(res => {
        toast.update(idToast, { render: 'Khoá thành công', autoClose: 1200 })
      })
      .catch(err => {
        toast.update(idToast, { render: 'Khoá không thành công', autoClose: 1200 })
      })
  }
  const handleUpgradeUser = () => {
    setDialogUpgrade(false)
    const idToast = toast.loading('Đang nâng cấp...')
    apiAdmin.upgradeUser({
      id
    })
      .then(res => {
        toast.update(idToast, { render: 'Nâng cấp thành công', autoClose: 1200 })
      })
      .catch(err => {
        toast.update(idToast, { render: 'Nâng cấp không thành công', autoClose: 1200 })
      })
  }
  return (
    <>
      <Stack direction='row' justifyContent='flex-end' >

        <Tooltip title={status === 'unlock' ? "Khoá tài khoản" : "Kích hoạt"}>
          <IconButton
            onClick={() => setDialogUnlock(true)}>
            {
              status === 'unlock' ? <LockIcon color='primary' width={24} height={24} />
                : <LockOpenIcon color='primary' width={24} height={24} />
            }

          </IconButton>
        </Tooltip>
        {
          !premium &&
          <Tooltip title="Nâng cấp">
            <IconButton onClick={()=>setDialogUpgrade(true)}>
              <UpgradeIcon color='warning' width={24} height={24} />
            </IconButton>
          </Tooltip>
        }

        <Tooltip title="Xoá người dùng">
          <IconButton onClick={() => setOpenDialog(true)}>
            <DeleteForeverIcon color='error' width={24} height={24} />
          </IconButton>
        </Tooltip>
      </Stack>
      {
        openDialog &&
        <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Xoá học viên khỏi khoá học?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắn chắn xoá người dùng này khỏi hệ thống không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Huỷ</Button>
            <Button onClick={handleDeleteUser}>Xoá</Button>
          </DialogActions>
        </Dialog>
      }
      {
        dialogUnlock &&
        <Dialog
          open={dialogUnlock}
          TransitionComponent={Transition}
          keepMounted
          onClose={()=>setDialogUnlock(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{`${status === 'unlock'?'Khoá':'Mở khoá'} tài khoản người dùng`}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắn chắn ${status === 'unlock'?'khoá':'mở khoá'} người dùng này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setDialogUnlock(false)}>Huỷ</Button>
            <Button onClick={status === 'unlock'?handleLockUser:handleUnlockUser}>{status === 'unlock'?'Khoá':'Mở khoá'}</Button>
          </DialogActions>
        </Dialog>
      }
      {
        dialogUpgrade &&
        <Dialog
          open={dialogUpgrade}
          TransitionComponent={Transition}
          keepMounted
          onClose={()=>setDialogUpgrade(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>{"Nâng cấp tài khoản người dùng"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Bạn có chắn chắn nâng cấp tài khoản người dùng này không?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setDialogUpgrade(false)}>Huỷ</Button>
            <Button onClick={handleUpgradeUser}>Nâng cấp</Button>
          </DialogActions>
        </Dialog>
      }
    </>
  );
}
