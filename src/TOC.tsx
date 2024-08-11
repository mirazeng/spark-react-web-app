import {useLocation} from "react-router-dom";

export default function TOC() {
    const {pathname} = useLocation();

    return (
        <ul className="nav nav-pills">
            <li className="nav-item">
                <a id='wd-s' href="/Spark" className={`nav-link ${pathname.includes("Spark") ? "active" : ""}`}>
                    Spark
                </a>
            </li>
            <li className="nav-item">
                <a id="wd-github" href="https://github.com/mirazeng/kanbas-react-web-app" className="nav-link">
                    Miranda's GitHub
                </a>
            </li>
        </ul>);
}