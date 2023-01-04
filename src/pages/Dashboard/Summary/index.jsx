import React, { useEffect, useState } from 'react'
import Page from 'components/Page'
import {
  Paper,
  Stack,
} from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2';
import AppWidgetSummary from 'components/AppWidgetSummary';
import PieChartPoint from './PieChartPoint';
import apiAdmin from 'apis/apiAdmin';
function Summary(props) {
  const [noUsers, setNoUsers] = useState(0)
  const [noExams, setNoExams] = useState(0)
  const [noAssignments, setNoAssignments] = useState(0)
  const [noCourses, setNoCourses] = useState(0)
  useEffect(()=>{
    const getData = async()=>{
      const response = await Promise.all([
        apiAdmin.getNumberOfCourses().then(res=>res).catch(err=>({numberCourse:null})),
        apiAdmin.getNumberOfExams().then(res=>res).catch(err=>({numberExam:null})),
        apiAdmin.getNumberOfAssignments().then(res=>res).catch(err=>({numberAssignment:null})),
        apiAdmin.getNumberOfUsers().then(res=>res).catch(err=>({numberUser:null})),
      ])
      setNoCourses(response?.[0]?.numberOfCourses)
      setNoExams(response?.[1]?.numberOfExam)
      setNoAssignments(response?.[2]?.numberOfAssignment)
      setNoUsers(response?.[3]?.numberOfUsers)
    }
    getData()
  },[])
  return (
    <Page title='Tổng quan'>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Số lượng người dùng" total={noUsers} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Số lượng khoá học" total={noCourses} color="info" icon={'ant-design:apple-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Số lượng bài thi" total={noExams} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Số lượng bài tập" total={noAssignments} color="error" icon={'ant-design:bug-filled'} />
          </Grid>
        </Grid>

      </Stack>
    </Page>
  )
}

Summary.propTypes = {}

export default Summary
