import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../config/Api";
import ShopCard from "../../components/ShopCard/ShopCard";
import "./ShopsPage.css";
import { useDispatch, useSelector } from "react-redux";
import { getShops } from "../../redux/Shop/Actions";

const ShopsPage = () => {
    const shops = useSelector((state) => state.shop?.shops || []);
    const loading = useSelector((state) => state.shop?.loading || false);
    const error = useSelector((state) => state.shop?.error || null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getShops());
    }, [dispatch]);

    const handleShopClick = (shop, isMenuView = false) => {
        const path = `/shops/${encodeURIComponent(shop.name)}`;
        navigate(path, { state: { shopId: shop.id } });
    };

    if (loading) {
        return (
            <div className="shops-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading shops...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="shops-page">
                <div className="error-container">
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()}>Try Again</button>
                </div>
            </div>
        );
    }

    return (
        <div className="shops-page">
            <div className="shops-header">
                <h1>Explore Our Partner Shops</h1>
                <p>Discover the best food from top shops in Hoa Lac</p>
            </div>

            {shops.length === 0 ? (
                <div className="no-shops">
                    <p>No shops available at the moment. Please check back later.</p>
                </div>
            ) : (
                <div className="shops-grid">
                    {shops.map((shop) => (
                        <ShopCard
                            key={shop.id}
                            shop={shop}
                            onClick={(isMenuView) => handleShopClick(shop, isMenuView)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShopsPage; 