/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
import React, { Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'
// routes config
import routes from '../routes'
import Dashboard from 'src/dashboard/Dashboard'
import Home from 'src/pages/home/Home'

const AppContent = (usertype) => {

  return (
    <div>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Home />} />

        </Routes>
      </Suspense>
    </div>
  )
}

export default React.memo(AppContent)
