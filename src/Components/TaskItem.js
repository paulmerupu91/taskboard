import React, {useState, useRef, useContext, useEffect} from 'react';
import MoveToSection from './Icons/MoveToSection';
import Delete from './Icons/Delete';
import Drag from './Icons/Drag';
import AppContext from '../Context/AppContext';
import { sortableHandle } from 'react-sortable-hoc';

const DragHandle = sortableHandle( () => <span className="p-2 " style={{cursor: 'grab'}}><Drag /></span> );

function TaskItem( {task, parentId} ) {

    const {
        taskToMoveSection,
        setTaskToMoveSection,
        sections,
        handleMoveToSection,
        updateTask,
        deleteTask
    } = useContext( AppContext );

    const elTaskRef = useRef( null );
    const elUpdateTaskInput = useRef( null );

    const handleTaskToMove = (e) => {

        e?.stopPropagation?.();
        setTaskToMoveSection( {
            task, 
            parentId
        } )
    }

    const handleTaskEdit = () => {
        setTaskEditOn( !taskEditOn );
    }

    const [newTaskContent, setNewTaskContent] = useState( task );
    const [taskEditOn, setTaskEditOn] = useState( '' );

    const thisIsTaskToMoveSections = taskToMoveSection?.task === task;

    useEffect( () => {
        if ( elUpdateTaskInput ){
            elUpdateTaskInput?.current?.focus?.();
        }
    }, [taskEditOn] )

    

    return (
        <>
            <div
                ref={elTaskRef}
                style={{
                    userSelect: 'none'
                }}
                data-parent-id={parentId}
                className={`mb-3 mt-4 rounded-3 overflow-hidden ${( thisIsTaskToMoveSections || taskEditOn ) ? `text-primary border border-primary shadow` : `shadow-sm bg-light `}`}
                // style={{
                //     position: 'relative',
                //     transform: `translateY(${taskElHeight}px)`
                // }}
                
            >
                <div className={`d-flex justify-content-between bg-light ${thisIsTaskToMoveSections && 'border border-bottom border-top-0 border-start-0 border-end-0'}`}>
                    <div style={{flexBasis: '100%'}} className="p-2 d-flex align-items-center justify-content-between" onClick={ () => handleTaskEdit() }>
                        <span>
                            { task }
                        </span>
                        { taskEditOn && <span className="text-danger" onClick={ () => deleteTask({task}) }><Delete /></span> }
                    </div>

                    {
                    !taskEditOn &&
                    <div className="d-flex align-items-center text-secondary">
                        <div
                            onClick={ (e) => handleTaskToMove(e) }
                            className="me-2 d-inline-flex align-items-center p-2 "
                            role="button"
                        >
                            <MoveToSection />
                        </div>
                        <DragHandle />
                    </div>
                    }
                </div>

                { thisIsTaskToMoveSections &&
                    <div className="move-to-section text-secondary my-3 p-2 d-flex flex-column align-items-center ">
                        <h5 className='text-small h6 '>Move to:</h5>
                        <div className="h5 d-flex align-content-center justify-content-center flex-wrap">
                            { sections.map( section => 
                                section.id !== parentId &&
                                <span
                                    class="btn  rounded-pill btn-secondary mx-2 my-2"
                                    role="button"
                                    onClick={ () => handleMoveToSection( {task: taskToMoveSection.task, parentId: section.id } ) }
                                >
                                    {section.title || <span className="text-warning">Untitled</span>}
                                </span>
                            )}
                        </div>
                    </div>
                }
                { taskEditOn &&
                    <div className="text-secondary d-flex flex-column align-items-center ">
                        <div className="d-flex align-content-stretch justify-content-stretch flex-column w-100">
                            <div className="input-group p-2 p-lg-4 mb-3 mb-lg-0">
                                <input
                                    ref={elUpdateTaskInput}
                                    class="form-control bg-white"
                                    type="text"
                                    value={newTaskContent}
                                    onChange={ e => setNewTaskContent( e.target.value ) }
                                    onKeyDown={ e => e?.key === "Enter" && updateTask( { newTask: newTaskContent, oldTask: task } ) }
                                    // onBlur={ () => newTaskContent === task && setTaskEditOn( !taskEditOn ) }
                                />
                                
                                <button
                                    className="btn btn-outline-primary btn-sm"
                                    onClick={ () => updateTask( { newTask: newTaskContent, oldTask: task } ) }
                                >
                                    Update
                                </button>
                            </div>

                            <button className="btn btn-warning w-100 rounded-0"
                                onClick={ () => setTaskEditOn( false ) }
                            >Cancel</button>
                        </div>
                    </div>
                }
            </div>

        </>
    )
}

export default TaskItem
