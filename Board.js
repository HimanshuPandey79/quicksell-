import React, { useEffect, useState } from 'react';
import Card from './Card';
import GroupSelector from './GroupSelector';
import SortSelector from './SortSelector';
import './Board.css';

// Import SVGs for icons
import AddIcon from '../assets/add.svg';
import DotsIcon from '../assets/3 dot menu.svg';
import BacklogIcon from '../assets/Backlog.svg';
import CancelledIcon from '../assets/Cancelled.svg';
import DoneIcon from '../assets/Done.svg';
import InProgressIcon from '../assets/in-progress.svg';
import TodoIcon from '../assets/To-do.svg';

const Board = () => {
    const [tickets, setTickets] = useState([]);
    const [grouping, setGrouping] = useState('status');
    const [sorting, setSorting] = useState('priority');

    useEffect(() => {
        // Fetch data from the provided API
        fetch('https://api.quicksell.co/v1/internal/frontend-assignment')
            .then(response => response.json())
            .then(data => setTickets(data.tickets))
            .catch(error => console.error('Error fetching data:', error));

        // Load saved view state from localStorage
        const savedGrouping = localStorage.getItem('grouping');
        const savedSorting = localStorage.getItem('sorting');
        if (savedGrouping) setGrouping(savedGrouping);
        if (savedSorting) setSorting(savedSorting);
    }, []);

    useEffect(() => {
        // Save view state to localStorage
        localStorage.setItem('grouping', grouping);
        localStorage.setItem('sorting', sorting);
    }, [grouping, sorting]);

    // Grouping logic with clear display names
    const groupTickets = () => {
        const grouped = {};
        tickets.forEach(ticket => {
            let key;
            if (grouping === 'status') {
                key = ticket.status || 'No Status';
            } else if (grouping === 'user') {
                key = `User-${ticket.userId}` || 'Unassigned';
            } else if (grouping === 'priority') {
                key = `Priority-${ticket.priority}` || 'No Priority';
            }

            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(ticket);
        });
        return grouped;
    };

    // Sorting logic
    const sortTickets = (grouped) => {
        const sortedGrouped = {};
        Object.keys(grouped).forEach(group => {
            sortedGrouped[group] = [...grouped[group]].sort((a, b) => {
                if (sorting === 'priority') {
                    return b.priority - a.priority; // Higher priority first
                } else if (sorting === 'title') {
                    return a.title.localeCompare(b.title); // Alphabetical order
                }
                return 0;
            });
        });
        return sortedGrouped;
    };

    const groupedTickets = sortTickets(groupTickets());

    // Icon selection based on group title (only for known groups)
    const getGroupIcon = (group) => {
        if (group.includes('Todo')) return TodoIcon;
        if (group.includes('In progress')) return InProgressIcon;
        if (group.includes('Done')) return DoneIcon;
        if (group.includes('Backlog')) return BacklogIcon;
        if (group.includes('Cancelled')) return CancelledIcon;
        return null; // No icon for user and priority groups
    };

    return (
        <div>
            <div className="selectors">
                <GroupSelector grouping={grouping} setGrouping={setGrouping} />
                <SortSelector sorting={sorting} setSorting={setSorting} />
            </div>
            <div className="kanban-board">
                {Object.keys(groupedTickets).map(group => (
                    <div key={group} className="kanban-group">
                        <div className="kanban-group-header">
                            <h2>
                                {getGroupIcon(group) && (
                                    <img src={getGroupIcon(group)} alt={`${group} Icon`} className="header-icon" />
                                )}
                                {group}
                            </h2>
                            <img src={DotsIcon} alt="Options" className="options-icon" />
                        </div>
                        <button className="add-button">
                            <img src={AddIcon} alt="Add" />
                        </button>
                        <div className="kanban-group-content">
                            {groupedTickets[group].map(ticket => (
                                <Card key={ticket.id} ticket={ticket} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Board;
