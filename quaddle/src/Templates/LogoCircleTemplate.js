import React from 'react'

const LogoCircleTemplate = (user) =>
    <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px', backgroundColor: user?.logoColor, }}>
        <span className="text-white fw-bold">{user?.initials}</span>
    </div>



export default LogoCircleTemplate