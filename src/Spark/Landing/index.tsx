import React from 'react';
import {Link} from 'react-router-dom';

export default function SearchLanding() {
    const recipeData = [
        {
            id: 1,
            name: "Homemade Pizza",
            image: "pizza.jpg",
            creator: "JohnDoe",
            description: "Delicious homemade pizza with fresh ingredients."
        },
        {
            id: 2,
            name: "Veggie Stir-Fry",
            image: "stirfry.jpg",
            creator: "AliceSmith",
            description: "Quick and healthy vegetable stir-fry."
        },
        {
            id: 3,
            name: "Chocolate Cake",
            image: "cake.jpg",
            creator: "BakeMaster",
            description: "Rich and moist chocolate cake for any occasion."
        },
        {
            id: 4,
            name: "Grilled Salmon",
            image: "salmon.jpg",
            creator: "SeafoodLover",
            description: "Perfectly grilled salmon with lemon and herbs."
        },
        {
            id: 5,
            name: "Spaghetti Carbonara",
            image: "carbonara.jpg",
            creator: "PastaFan",
            description: "Classic Italian pasta dish with creamy sauce."
        },
        {
            id: 6,
            name: "Berry Smoothie",
            image: "smoothie.jpg",
            creator: "HealthyEats",
            description: "Refreshing smoothie packed with antioxidants."
        },
        {
            id: 7,
            name: "Beef Tacos",
            image: "tacos.jpg",
            creator: "MexicanFoodie",
            description: "Spicy beef tacos with fresh toppings."
        },
        {
            id: 8,
            name: "Mushroom Risotto",
            image: "risotto.jpg",
            creator: "ItalianChef",
            description: "Creamy risotto with wild mushrooms."
        }
    ];

    return (
        <div className="container-fluid min-vh-100 d-flex flex-column">
            <div className="row py-3">
                <div className="col-6">
                    <Link to="/" className="text-decoration-none">
                        <div className="fs-1 fw-bold">
                            <span className="text-danger">S</span>
                            <span className="text-success">p</span>
                            <span className="text-primary">a</span>
                            <span className="text-warning">r</span>
                            <span className="text-info">k</span>
                        </div>
                    </Link>
                </div>
                <div className="col-6 text-end">
                    <Link to="/Account/Signin" className="btn btn-outline-success me-2">Sign in</Link>
                    <Link to="/Account/Signup" className="btn btn-outline-primary">Sign up</Link>
                </div>
            </div>

            <div className="row flex-grow-1">
                <div className="col-12 col-lg-10 mx-auto d-flex flex-column justify-content-center">
                    <form className="d-flex mb-4">
                        <input
                            className="form-control form-control-lg me-2"
                            type="search"
                            placeholder="Search recipes..."
                            aria-label="Search"
                        />
                        <button className="btn btn-danger btn-lg" type="submit">Go</button>
                    </form>

                    <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
                        {recipeData.map((recipe) => (
                            <div className="col" key={recipe.id}>
                                <div className="card h-100 shadow-sm">
                                    <img
                                        src={`/images/${recipe.image}`}
                                        className="card-img-top"
                                        alt={recipe.name}
                                        style={{height: '120px', objectFit: 'cover'}}
                                    />
                                    <div className="card-body p-2">
                                        <h6 className="card-title mb-0">{recipe.name}</h6>
                                        <p className="card-text small text-muted mb-2"
                                           style={{height: '3em', overflow: 'hidden'}}>
                                            {recipe.description}
                                        </p>
                                        <Link to={`/recipe/${recipe.id}`} className="btn btn-sm btn-outline-info">
                                            View
                                        </Link>
                                    </div>
                                    <div className="card-footer p-2">
                                        <small className="text-muted">
                                            By: <Link to={`/user/${recipe.creator}`}
                                                      className="text-decoration-none">{recipe.creator}</Link>
                                        </small>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}