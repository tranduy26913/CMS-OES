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
import apiAdmin from 'apis/apiAdmin';
import { toast } from 'react-toastify';
// ----------------------------------------------------------------------
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function UserMoreMenu({ id }) {

  const [openDialog, setOpenDialog] = useState(false);


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
  
  return (
    <>
      <Stack direction='row' justifyContent='flex-end' >

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
          <DialogTitle>{"Xoá học viên khỏi hệ thống?"}</DialogTitle>
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
      
    </>
  );
}
