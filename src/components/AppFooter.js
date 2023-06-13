/* eslint-disable prettier/prettier */
import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter>
      <div>
        <span>
          Copyright
        </span>
        <span className="ms-1">&copy; <a href="https://skyban.in/" target="_blank" rel="noopener noreferrer">
          Skyban Technology Pvt Ltd
        </a></span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by:</span>
        <a href="https://skyban.in/" target="_blank" rel="noopener noreferrer">
          Skyban Technology Pvt Ltd
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
