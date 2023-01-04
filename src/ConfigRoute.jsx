import Page404 from 'components/ErrorPage/Page404';
import LoadingPage from 'components/LoadingPage';
import MaintenancePage from 'components/MaintenancePage';
import LayoutCourse from 'pages/Course/LayoutCourse';
import StatisticExam from 'pages/Dashboard/StatisticExam';
import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard"

import { DASHBOARD_STUDENT, DASHBOARD_TEACHER } from "constraints/StudentDashboard";
import { useSelector } from 'react-redux';
const Home = lazy(() => import("./pages/Home"));
//const Dashboard = lazy(() => import("./pages/Dashboard"));
const Login = lazy(() => import("./components/Login"));
const Profile = lazy(() => import("pages/Dashboard/Profile"));
const ListCourse = lazy(() => import("pages/Dashboard/ListCourse"));
const ChangePassword = lazy(() => import("pages/Dashboard/Profile/ChangePassword"));
const ListExaminationTeacher = lazy(() => import("pages/Course/ListExamination"));
const ListStudent = lazy(() => import("pages/Course/ListStudent"));
const CreateCourse = lazy(() => import("pages/Course/CreateCourse"));
const QuestionBank = lazy(() => import("pages/Dashboard/QuestionBank"));
const QuestionBankDetail = lazy(() => import("pages/Dashboard/QuestionBankDetail"));
const ManageBill = lazy(() => import("pages/Dashboard/ManageBill"));
const ManageUser = lazy(() => import("pages/Dashboard/ManageUser"));
const ResetPassword = lazy(() => import("pages/ResetPassword"));
const Summary = lazy(() => import("pages/Dashboard/Summary"));
const SummaryUser = lazy(() => import("pages/Dashboard/SummaryUser"));

const makeLoading = (component) => <Suspense fallback={<LoadingPage />}>{component}</Suspense>

const TEACHER = [
  {
    path: 'summary',
    component: Summary
  },
  {
    path: 'summary-user',
    component: SummaryUser
  },
  {
    path: 'profile',
    component: Profile
  },
  {
    path: 'manage-course',
    component: ListCourse
  },
  {
    path: 'manage-user',
    component: ManageUser
  },
  {
    path: 'question-bank',
    component: QuestionBank
  },
  {
    path: 'question-bank/:slug',
    component: QuestionBankDetail
  },
  {
    path: 'manage-bill',
    component: ManageBill
  },
  {
    path: 'notify',
    component: MaintenancePage
  },
  {
    path: 'manage-takeexam',
    component: StatisticExam
  },
  {
    path: 'profile/change-password',
    component: ChangePassword
  },
]


function ConfigRoute() {

  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Routing customer account */}

        <Route path="/" element={<Dashboard sidebarTab={DASHBOARD_TEACHER} />} >
        <Route index element={makeLoading(<Summary />)} />
          {
            TEACHER.map(item =>
              <Route key={item.path} path={item.path} element={makeLoading(<item.component />)} />)
          }
        </Route>

        <Route path="login" element={<Login />} />
        
        <Route path="loading" element={<LoadingPage />} />
        <Route path="aboutus" element={<MaintenancePage />} />
        <Route path="review-exam/:id" element={<MaintenancePage />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />
        <Route path="/*" element={<Page404 />} />


      </Routes>
    </Suspense>
  );
}

export default ConfigRoute;
