import React, { useEffect, useState } from 'react'
import Page from 'components/Page'
import {
  Paper,
  Stack,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2';
import AppWidgetSummary from 'components/AppWidgetSummary';
import PieChartPoint from './PieChartPoint';
import TableStudent from './TableStudent';
import apiAdmin from 'apis/apiAdmin';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import DiamondIcon from '@mui/icons-material/Diamond';

function SummaryUser(props) {
  const [users, setUsers] = useState(samples)
  useEffect(() => {
    const loadListUser = () => {//lấy danh sách bài kiểm tra

      apiAdmin.getAllCourses()
        .then(res => {
          setUsers(res)
        })
    }
    //loadListUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

const count = users.length
const countTeacher = users.reduce((total,cur)=>cur.role ==='TEACHER'?total+1:total, 0)
const countStudent = users.reduce((total,cur)=>cur.role ==='STUDENT'?total+1:total, 0)
const countAdmin = users.reduce((total,cur)=>cur.role ==='ADMIN'?total+1:total, 0)
const countPremium = users.reduce((total,cur)=>cur.premium?total+1:total, 0)
  return (
    <Page title='Tổng quan'>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Số lượng người dùng" total={count} Icon={PersonIcon} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Số lượng giáo viên" total={countTeacher} color="info" Icon={SchoolIcon} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Số lượng học viên" total={countStudent} color="warning" Icon={HistoryEduIcon} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Số lượng tài khoản Premium" total={countPremium} color="error" Icon={DiamondIcon} />
          </Grid>
        </Grid>


        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Paper>
              <PieChartPoint
                chartData={[
                  { label: 'Giáo viên', value: countTeacher },
                  { label: 'Học viên', value: countStudent },
                  { label: 'Quản trị viên', value: countAdmin }
                ]}
              /></Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper>
              <PieChartPoint
                chartData={[
                  { label: 'Premium', value: countPremium },
                  { label: 'Free', value: count-countPremium },
                ]}
              /></Paper>
          </Grid>
        </Grid>

        <Paper>
          <TableStudent />
        </Paper>

      </Stack>
    </Page>
  )
}

const samples = [
  {
    id: 1,
    fullname: 'Trần Duy',
    gender: 'male',
    birthday: new Date().toISOString(),
    role: 'TEACHER',
    premium: true,
    status: 'active'
  },
  {
    id: 1,
    fullname: 'Trần Duy',
    gender: 'male',
    birthday: new Date().toISOString(),
    role: 'STUDENT',
    premium: false,
    status: 'inactive'
  }
]

export default SummaryUser
