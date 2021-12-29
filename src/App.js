import './App.css';
import './custom.scss';
import { useState, useContext, useRef, useEffect } from 'react';
import AppContext from './Context/AppContext';

import Edit from './Components/Icons/Edit';
import Add from './Components/Icons/Add';
import Settings from './Components/Icons/Settings';

import TaskItem from './Components/TaskItem';

import {SortableContainer, SortableElement} from 'react-sortable-hoc';
import {arrayMoveImmutable} from 'array-move';

import BackgroundSelection from './Components/BackgroundSelection';

function App() {

    const [sections, setSections] = useState( JSON.parse( localStorage.getItem('taskboard-app-sections') ) || [] );
    const [tasks, setTasks] = useState( JSON.parse( localStorage.getItem('taskboard-app-tasks') ) || [] );

    console.log( 'tasks', tasks );

    const [taskToMoveSection, setTaskToMoveSection] = useState( null );
    const [sectionToSort, setSectionToSort] = useState( null );

    const [appSettingsOpen, setAppSettingsOpen] = useState( false );
    const [bgSrc, setBgSrc] = useState( JSON.parse( localStorage.getItem('taskboard-app-bg-img') ) || '' );
    const [bgColor, setBgColor] = useState( JSON.parse( localStorage.getItem('taskboard-app-bg-color') ) || '' );

    // Load content from LocalStorage
    useEffect( () => {

        const updateLocalStorageData = () => {
            localStorage.setItem('taskboard-app-tasks', JSON.stringify( tasks ) );
            localStorage.setItem('taskboard-app-sections', JSON.stringify( sections ) );
            localStorage.setItem('taskboard-app-bg-color', JSON.stringify( bgColor ) );
            localStorage.setItem('taskboard-app-bg-img', JSON.stringify( bgSrc ) );
        }

        updateLocalStorageData();
        
    }, [tasks, sections, bgSrc, bgColor] )

    const handleSectionName = ( {id, val} ) => {
        const sectionsCopy = [...sections.map( sec => {
            if( sec.id === id ){
                sec.title = val
            }
            return sec;
        } )];
        setSections( sectionsCopy );
    }

    const handleNewTask = ( { parentId = false, task = false } ) => {
        console.log( 'parentId', parentId );
        console.log( 'task', task );

        if( parentId && task && ![...tasks.map( task => task.task )].includes( task ) ){
            setTasks( [...tasks, {
                parentId,
                task
            } ] )
        }

    }

    const updateSortingSection = ( parentId ) => {
        if( parentId ){
            setSectionToSort( parentId );
        }
    }

    const handleMoveToSection = ( {parentId, task} ) => {

        console.log( 'handleMoveToSection' );
        console.log( 'parentId', parentId );
        console.log( 'task', task );

        if( parentId && task ){
            const updatedTasks = [...tasks].map( taskItem => {
                console.log( 'taskItem', taskItem );
                if( taskItem.task === task ){
                    taskItem.parentId = parentId;
                }
                return taskItem
            } );

            console.log( 'updatedTasks', updatedTasks );
    
            setTasks( updatedTasks );
        }
    }

    const onSortEnd = ({oldIndex, newIndex, collection}) => {
        console.log( 'oldIndex', oldIndex );
        console.log( 'newIndex', newIndex );
        console.log( 'sectionToSort', sectionToSort );

        const tasksFromSection = [...tasks].filter( task => task?.parentId === sectionToSort );
        const tasksNotFromSection = [...tasks].filter( task => task?.parentId !== sectionToSort );

        setTasks(() => (
            [
                ...tasksNotFromSection,
                ...arrayMoveImmutable(tasksFromSection, oldIndex, newIndex)
            ]
        ));

        setSectionToSort( null );
    };

    const updateTask = ({oldTask, newTask}) => {
        console.log( 'updateTask', {oldTask, newTask} );
        if( oldTask && newTask && oldTask.trim?.().length && newTask.trim?.().length ){
            let updatedTasks = [...tasks]?.map?.( (t, i)=>{
                if( oldTask === t.task ){
                    t.task = newTask;
                }
                return t;
            } );
            setTasks( updatedTasks );
        }
    }

    const deleteTask = ( {task} ) => {
        setTasks( [...tasks].filter( t => t.task !== task ) );
    }

    useEffect( () => {

        const clickedAway = () => {
            console.log( 'clickedAway', 'clickedAway' );
            setTaskToMoveSection(null);
            window.removeEventListener( 'click', clickedAway );
        };

        window.removeEventListener( 'click', clickedAway );
        
        window.addEventListener( 'click', clickedAway )
        
    }, [taskToMoveSection] )
    
    useEffect( () => {
        const elBody = document.querySelector( 'body' );
        const elHtml = document.querySelector( 'html' );
        if( bgSrc ){


            elBody.style.background = `url(${bgSrc})`;

            elBody.style.height = `100%`;
            elHtml.style.height = `100%`;

            elBody.style.backgroundSize = 'cover';
            elBody.style.backgroundRepeat = 'none';
            elBody.style.backgroundPosition = 'center';

        } else {
            elBody.style.background = 'none';
        }

    }, [bgSrc] )
    useEffect( () => {
        if( bgColor ){

            const elBody = document.querySelector( 'body' );
            const elHtml = document.querySelector( 'html' );

            elBody.style.background = `${bgColor}`;

            elBody.style.height = `100%`;
            elHtml.style.height = `100%`;

        }

    }, [bgColor] )

    const sectionClass = `col-12 col-sm-12 col-md-6 col-lg-4 col-xxl-3 my-3`;

    return (
        <AppContext.Provider value={{
            tasks: tasks,
            sections,
            handleNewTask,

            taskToMoveSection,
            setTaskToMoveSection,

            handleMoveToSection,
            updateSortingSection,
            onSortEnd,

            bgSrc,
            setBgSrc,

            bgColor,
            setBgColor,

            appSettingsOpen,
            setAppSettingsOpen,

            updateTask,
            deleteTask
        }}>
            <div className="App container-fluid px-4 py-4"
                // style={{background: `url(${bgSrc})`}}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <h1 className={`${bgSrc && `text-white`}`}>TaskBoard</h1>
                    <div className="text-dark d-flex align-items-center justify-content-center bg-light rounded-pill p-2"
                        onClick={ () => setAppSettingsOpen(!appSettingsOpen) }
                    >
                        <Settings />
                    </div>
                </div>

                <BackgroundSelection />
                
                { !appSettingsOpen &&
                <div className="row d-flex" >
                    { sections.map( section =>
                        <div className={sectionClass} key={section?.id} data-section-id={section?.id}>
                            <div className="section-content bg-white p-3 rounded-3 shadow-sm">
                                <Section section={section} handleSectionName={handleSectionName} />
                            </div>
                        </div>
                    ) }
                    <div className={`${sectionClass} `}>
                    <div className="d-flex bg-light shadow-sm rounded-3 p-5  h-100 align-items-center justify-content-center">

                        <button className="btn btn-outline-secondary section-content p-3"
                            onClick={ () => setSections( [...sections, { id: Math.random() + Math.random(), title: '' } ] ) }>
                            Add a Section
                        </button>
                    </div>
                    </div>
                </div>
                }

            </div>
        </AppContext.Provider>
    );
}

export default App;

function Section( { section, handleSectionName } ){

    const [editMode, setEditMode] = useState( false );
    const [newTaskMode, setNewTaskMode] = useState( false );
    const [taskContent, setTaskContent] = useState( '' );
    const {
        handleNewTask,
        tasks,
        taskToMoveSection,
        handleMoveToSection,
        updateSortingSection,
        onSortEnd,
    } = useContext( AppContext );

    const sectionTitleInputRef = useRef( null );

    const inputNewTaskRef = useRef( null );
    const handleTask = () => {
        handleNewTask( {parentId: section.id, task: taskContent?.trim()} );
        setTaskContent( '' );
        inputNewTaskRef.current.focus();
    }

    useEffect(() => {
        
        editMode && sectionTitleInputRef?.current?.focus?.();
        
    }, [editMode])
    useEffect(() => {

        newTaskMode && inputNewTaskRef?.current?.focus?.();
        
    }, [newTaskMode])
    

    const handleSectionNameChange = (e) => {
        handleSectionName( {val: e.target.value, id: section?.id } );
    }

    const tasksInSection = tasks?.filter?.( (task) => task?.parentId === section?.id );

    

    return(
        <div className="position-relative" style={{minHeight: '180px'}}>

            { !editMode &&
                <>
                <div className="border-0 border-bottom ">
                    <h4 onClick={ () => setEditMode( true ) }
                        className='mb-2 mb-0 p-0 text-primary'
                    >
                        { section?.title }

                        { section?.title?.length === 0 && <span className="text-secondary">Add a title</span> }
                    </h4>
                    <button className={`position-absolute top-0 btn p-0 text-secondary`} style={{right: 0}} onClick={ () => setEditMode( true ) }><Edit /></button>
                </div>
                </>
            }
            { editMode &&
                <>
                <div className="border-0 border-bottom ">
                    <input className="h4 mb-2 mb-0 p-0 px-2 w-100"
                        ref={sectionTitleInputRef}
                        value={ section?.title }
                        onBlur={ e => setEditMode( false ) }
                        onChange={ e => handleSectionNameChange(e) }
                        onKeyPress={ e => e?.key === 'Enter' && setEditMode( false ) }
                    >
                    </input>
                    {/* <button
                        style={{right: 0}}
                        className={`position-absolute top-0 btn p-0 text-secondary`}
                        onClick={ () => setEditMode( false ) }
                    >
                        <Done />
                    </button> */}
                </div>
                    {/* <div className="my-2">
                        <h5>Label Color <Color /></h5>
                    </div> */}
                </>
            }

            <div className="position-relative ">
                {/* { 
                    taskToMoveSection?.task && taskToMoveSection?.parentId !== section.id &&
                    <div
                        className="mt-4 py-5 top-0 w-100 h-100 border bg-light border-warning rounded-3 overflow-hidden d-flex align-items-center justify-content-center"
                    >
                        
                        <div className='d-flex flex-column'>
                            <span className='d-inline-flex mb-3'>Move here?</span>
                            <button className="btn btn-outline-secondary"
                                onClick={ () => handleMoveToSection( {task: taskToMoveSection.task, parentId: section.id } ) }
                            >
                                Move
                            </button>
                        </div>
                        
                    </div>
                } */}

                {/* { tasks?.map?.( (task, index) => task?.parentId === section?.id &&
                    <TaskItem task={task?.task} key={`${task.parentId}-${task.task}`}
                        parentId={task.parentId} /> )
                } */}
                
                <SortableList 
                    updateBeforeSortStart={()=>updateSortingSection( section?.id )}
                    items={tasksInSection} onSortEnd={onSortEnd}
                    pressDelay={100}
                    useDragHandle
                />
                
                { !newTaskMode &&
                    <div
                        role="button"
                        className="border p-2 mt-4 d-flex justify-content-center"
                        onClick={() => setNewTaskMode( true )}>
                        <Add />
                    </div>
                }

                { newTaskMode &&
                <>

                    {/* { taskContent && <div className="p-2 bg-light my-3 shadow-sm">{taskContent}</div> } */}
                    <h5 className="mt-5">
                        New Task
                    </h5>
                    <input
                        onBlur={( () => taskContent?.trim?.().length === 0 && setNewTaskMode( false ) )}
                        className="h5 pb-2 mb-0 px-3 py-2 w-100"
                        ref={inputNewTaskRef} type="text" value={taskContent}
                        onChange={ (e) => setTaskContent(e.target.value) }
                        onKeyPress={ e => e?.key === 'Enter' && taskContent && handleTask() }
                    />

                    <div>
                        <button className={`btn btn-outline-secondary mt-4 d-inline-flex align-items-center me-2`} onClick={() => setNewTaskMode( false )}><span className="">Cancel</span></button>
                        <button className={`btn btn-primary mt-4 d-inline-flex align-items-center me-2`} onClick={() => taskContent && handleTask()}><span className="me-2">Add</span> <Add /></button>
                    </div>
                </>
                }
            </div>

            

            
            
        </div>
    )

}

const SortableList = SortableContainer(({items}) => {
    return (
      <div>
        {items.map((value, index) => (
          <SortableItem key={`item-${value.parentId}-${value.task}`} index={index} task={value} />
        ))}
      </div>
    );
});

const SortableItem = SortableElement(({task}) => <TaskItem task={task?.task} key={`${task.parentId}-${task.task}`}
parentId={task.parentId} />);