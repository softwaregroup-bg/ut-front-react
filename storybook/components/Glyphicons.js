import React from 'react';
import { storiesOf } from '@kadira/storybook';
import Glyphicon, {iconNames} from '../../components/Glyphicon';

storiesOf('Glyphicons', module)
    .add('All Icons', () => (
        <div>
            <div>
                {iconNames.map((item, index) => {
                    return <div key={index} style={{display: 'inline-block', float: 'left', border: '1px solid #000', margin: '5px', padding: '10px', width: '180px', height: '180px'}}>
                        <div style={{textAlign: 'center', margin: '20px', minHeight: '50px'}}>
                            <Glyphicon glyphicon={item} />
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <div>Usage:</div>
                            <div style={{fontWeight: 'bold'}}>icon: "{item}"</div>
                        </div>
                    </div>;
                })}
                {iconNames.map((item, index) => {
                    return <div key={index} style={{display: 'inline-block', float: 'left', border: '1px solid #000', margin: '5px', padding: '10px', width: '180px', height: '180px'}}>
                        <div style={{textAlign: 'center', margin: '20px', minHeight: '50px'}}>
                            <Glyphicon color='pink' glyphicon={item} />
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <div>Usage:</div>
                            <div style={{fontWeight: 'bold'}}>icon: "{item}"</div>
                        </div>
                    </div>;
                })}
                {iconNames.map((item, index) => {
                    return <div key={index} style={{display: 'inline-block', float: 'left', border: '1px solid #000', margin: '5px', padding: '10px', width: '180px', height: '180px'}}>
                        <div style={{textAlign: 'center', margin: '20px', minHeight: '50px'}}>
                            <Glyphicon color='green' glyphicon={item} />
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <div>Usage:</div>
                            <div style={{fontWeight: 'bold'}}>icon: "{item}"</div>
                        </div>
                    </div>;
                })}
                {iconNames.map((item, index) => {
                    return <div key={index} style={{display: 'inline-block', float: 'left', border: '1px solid #000', margin: '5px', padding: '10px', width: '180px', height: '180px'}}>
                        <div style={{textAlign: 'center', margin: '20px', minHeight: '50px'}}>
                            <Glyphicon color='green' size='50' glyphicon={item} />
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <div>Usage:</div>
                            <div style={{fontWeight: 'bold'}}>icon: "{item}"</div>
                        </div>
                    </div>;
                })}
            </div>
        </div>
    ));
