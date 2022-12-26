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
import moment from 'moment';

function StatisticExam(props) {
  const [exams, setExams] = useState([])
  useEffect(() => {
    const getStatistic = () => {
      apiAdmin.getAllTakeExam()
        .then(res => {
          setExams(res)
        })
    }
    getStatistic()
  }, [])

  const count = exams.length
  const avgPoints = (count && exams.reduce((total, cur) => total + cur.points, 0) / count) || 0
  const maxPoints = (count && exams[0].maxPoints) || null
  const avgDuration = (() => {
    let duration = 0
    exams.forEach(e => {
      duration += moment(e.submitTime).diff(e.startTime, 'minutes')
    })
    return (count && duration / count) || 0
  })()

  const summary = (() => {
    let pass = 0
    exams.forEach(e => {
      if (e.points / e.maxPoints >= 5)
        pass++

    })
    return (count && pass / count) || 0
  })()
  return (
    <Page title='Thống kê bài thi'>
      <Stack spacing={2}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Số lượt làm bài" total={exams.length} icon={'ant-design:android-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Kết quả trung bình" text={`${avgPoints.toFixed(2)}${maxPoints ? `/${maxPoints}` : ''}`} color="info" icon={'ant-design:apple-filled'} />
          </Grid>


          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Thời lượng trung bình" total={avgDuration} color="warning" icon={'ant-design:windows-filled'} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <AppWidgetSummary title="Tổng kết" text={`Đạt ${summary}%`} total={234} color="error" icon={'ant-design:bug-filled'} />
          </Grid>
        </Grid>

        <Paper>
          <TableStudent exams={exams} />
        </Paper>

      </Stack>
    </Page>
  )
}

StatisticExam.propTypes = {}

export default StatisticExam
