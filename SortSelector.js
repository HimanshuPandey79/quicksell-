import React from 'react';

const SortSelector = ({ sorting, setSorting }) => {
    return (
        <div>
            <label>Sort by:</label>
            <select value={sorting} onChange={(e) => setSorting(e.target.value)}>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
            </select>
        </div>
    );
};

export default SortSelector;