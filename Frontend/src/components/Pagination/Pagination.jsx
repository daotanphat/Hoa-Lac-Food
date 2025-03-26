import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        
        // Always show first page
        pageNumbers.push(
            <button 
                key={1} 
                onClick={() => onPageChange(1)} 
                className={currentPage === 1 ? "active" : ""}
            >
                1
            </button>
        );
        
        // Show pages around current page
        if (currentPage > 3) {
            pageNumbers.push(<span key="ellipsis1" className="ellipsis">...</span>);
        }
        
        // Show current page if not 1 or last
        if (currentPage > 1 && currentPage < totalPages) {
            pageNumbers.push(
                <button 
                    key={currentPage} 
                    onClick={() => onPageChange(currentPage)} 
                    className="active"
                >
                    {currentPage}
                </button>
            );
        }
        
        // Show ellipsis if needed
        if (currentPage < totalPages - 2) {
            pageNumbers.push(<span key="ellipsis2" className="ellipsis">...</span>);
        }
        
        // Always show last page if not page 1
        if (totalPages > 1) {
            pageNumbers.push(
                <button 
                    key={totalPages} 
                    onClick={() => onPageChange(totalPages)} 
                    className={currentPage === totalPages ? "active" : ""}
                >
                    {totalPages}
                </button>
            );
        }
        
        return pageNumbers;
    };

    if (totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button 
                onClick={handlePrevious} 
                className={`pagination-text ${currentPage === 1 ? "disabled" : ""}`}
                disabled={currentPage === 1}
            >
                <span>Back</span>
            </button>
            
            <div className="pagination-numbers">
                {renderPageNumbers()}
            </div>
            
            <button 
                onClick={handleNext} 
                className={`pagination-text ${currentPage === totalPages ? "disabled" : ""}`}
                disabled={currentPage === totalPages}
            >
                <span>Next</span>
            </button>
        </div>
    );
};

export default Pagination;