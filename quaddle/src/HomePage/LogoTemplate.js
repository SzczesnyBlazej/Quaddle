// LogoTemplate.js
import LogoutButton from "../Account/Logout";
import LogoCircleTemplate from "../Templates/LogoCircleTemplate";
const LogoTemplate = (user) =>

    <div className="dropdown" data-bs-toggle="tooltip" title={user?.name + " " + user?.surname}>
        <button
            className="btn dropdown-toggle rounded-circle dropdown-toggle-no-arrow border-0"
            type="button"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
        >
            {LogoCircleTemplate(user)}

        </button>
        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">

            <li><span className="dropdown-item ">{user?.name} {user?.surname}</span></li>
            <div className="dropdown-divider"></div>

            <li><a className="dropdown-item" href="#/action-2">Option 2</a></li>
            <li><a className="dropdown-item" href="#/action-3">Option 3</a></li>
            <div className="dropdown-divider"></div>
            <LogoutButton />
        </ul>
    </div>
    ;

export default LogoTemplate;
