import React, {useContext} from 'react';
import AppContext from '../Context/AppContext';
import Done from './Icons/Done';

function BackgroundSelection() {

    const bgImgList = [
        
        {
            src: '/pexels-kasuma-1785493.jpg',
            attribution: 'Photo by Kasuma from Pexels'
        },
        {
            src: '/pexels-paul-ijsendoorn-33041.jpg',
            attribution: 'Photo by Paul IJsendoorn from Pexels'
        },
        {
            src: '/pexels-aron-visuals-1643113.jpg',
            attribution: 'Photo by Aron Visuals from Pexels'
        },
        {
            src: '/pexels-trace-hudson-2770933.jpg',
            attribution: 'Photo by Trace Hudson from Pexels'
        },
        
    ]

    const bgColorList = [
        {
            color: '#e6eaed'
        },
        {
            color: '#d8ebe5'
        },
        {
            color: '#e8ddca'
        },
        {
            color: '#c5d9e6'
        },
        
    ]

    const handleColorChange = ( color ) => {
        setBgSrc(false);
        setBgColor(color);
    }
    const handleImgSrcChange = ( src ) => {
        setBgSrc(src);
        setBgColor(false);
    }

    const { bgSrc, setBgSrc, bgColor, setBgColor, appSettingsOpen } = useContext( AppContext );

    if( !bgSrc && !bgColor ){
        handleColorChange( bgColorList[0].color );
    }

    return (
        appSettingsOpen && <div className="mx-n3 rounded-3 bg-light shadow-lg p-3 py-4 mt-3 mb-4">

            <div className="row ">
                <div className="col-12">
                    <h5 className="text-secondary">Background Image</h5>
                </div>
                {
                    
                bgImgList?.map?.( img =>
                    <div className="col-xxl-2 col-6 mb-3">
                        <div
                            className="d-flex flex-column bg-white p-2 rounded-3 shadow position-relative" role='button'
                            onClick={ () => handleImgSrcChange(img?.src) }
                        >
                            { img.src === bgSrc &&
                                <div
                                    className="position-absolute me-3 mt-3 top-0 bg-success d-inline-flex align-items-center rounded-pill p-1 text-white"
                                    style={{right: 0}}
                                >
                                    <Done />
                                </div>
                            }

                            <img className="img-fluid rounded-3" src={img?.src} alt="" style={{aspectRatio: '16/9', objectFit: 'cover'}}/>
                            <span className="d-inline-flex mt-2 mb-n1" style={{fontSize: '12px'}}>{img?.attribution}</span>
                        </div>

                        
                    </div>
                )
                }
                <div className="col-12 mt-4">
                    <h5 className="text-secondary">Solid Color</h5>
                </div>
                {
                    
                bgColorList?.map?.( color =>
                    <div className="col-xxl-2 col-6 mb-3">
                        <div
                            className="d-flex flex-column bg-white p-2 rounded-3 shadow position-relative" role='button'
                            onClick={ () => handleColorChange(color.color) }
                        >
                            { color.color === bgColor &&
                                <div
                                    className="position-absolute me-3 mt-3 top-0 bg-success d-inline-flex align-items-center rounded-pill p-1 text-white"
                                    style={{right: 0}}
                                >
                                    <Done />
                                </div>
                            }

                            <div className="rounded-3"  style={{aspectRatio: '16/9', background: color.color}}></div>
                        </div>

                        
                    </div>
                )
                }
            </div>
        </div>
    )
}

export default BackgroundSelection
