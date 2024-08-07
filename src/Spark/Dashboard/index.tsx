export default function Dashboard() {
    return (
        <div id="wd-dashboard">
            <h2 id="wd-dashboard-title">Recipe Home</h2> <hr />
            <h2 id="wd-dashboard-published">Trending Sparks</h2> <hr />
            <div id="wd-dashboard-recipes">
                <div className="wd-dashboard-recipes">
                    <img src="/images/nycc.jpg" width={200} />
                    <div>
                        <a className="wd-dashboard-recipe-link"
                           href="#/Sparks/recipe/1234/Home">
                            New York Cheesecake
                        </a>
                    <br/>
                        <a className="wd-dashboard-recipe-title"
                           href="#/Sparks/user/uid/Home">
                            Miranda Zeng
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );}

