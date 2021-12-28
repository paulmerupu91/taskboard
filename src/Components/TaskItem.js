import React, {useEffect, useRef, useContext} from 'react';
import MoveToSection from './Icons/MoveToSection';
import Drag from './Icons/Drag';
import AppContext from '../Context/AppContext';
import { sortableHandle } from 'react-sortable-hoc';

const DragHandle = sortableHandle( () => <span style={{cursor: 'grab'}}><Drag /></span> );

function TaskItem( {task, parentId} ) {

    const {
        taskToEdit,
        setTaskToEdit,
        sections,
        handleMoveToSection
    } = useContext( AppContext );

    const elTaskRef = useRef( null );

    const handleTaskToEdit = (e) => {

        e?.stopPropagation?.();
        setTaskToEdit( {
            task, 
            parentId
        } )
    }

    const thisIsTaskToEdit = taskToEdit?.task === task;

    return (
        <>
            <div
                ref={elTaskRef}
                style={{
                    userSelect: 'none'
                }}
                data-parent-id={parentId}
                className={`mb-3 mt-4 rounded-3 overflow-hidden ${thisIsTaskToEdit ? `text-success border border-success shadow` : `shadow-sm bg-light `}`}
                // style={{
                //     position: 'relative',
                //     transform: `translateY(${taskElHeight}px)`
                // }}
                
                onBlur={() => setTaskToEdit(null)}
            >
                <div className={`d-flex justify-content-between p-2 bg-light ${thisIsTaskToEdit && 'border border-bottom border-top-0 border-start-0 border-end-0'}`}>
                    <span>
                        { task }
                    </span>

                    <div className="d-flex align-items-center text-secondary">
                        <div
                            onClick={ (e) => handleTaskToEdit(e) }
                            className="me-2 d-inline-flex align-items-center"
                            role="button"
                        >
                            <MoveToSection />
                        </div>
                        <DragHandle />
                    </div>
                </div>

                { thisIsTaskToEdit &&
                    <div className="move-to-section text-secondary my-3 p-2 d-flex flex-column align-items-center ">
                        <h5 className='text-small h6 '>Move to:</h5>
                        <div className="h5 d-flex align-content-center justify-content-center flex-wrap">
                            { sections.map( section => 
                                section.id !== parentId &&
                                <span
                                    class="btn  rounded-pill btn-secondary mx-2 my-2"
                                    role="button"
                                    onClick={ () => handleMoveToSection( {task: taskToEdit.task, parentId: section.id } ) }
                                >
                                    {section.title}
                                </span>
                            )}
                        </div>
                    </div>
                }
            </div>

        </>
    )
}

export default TaskItem
