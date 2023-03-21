import { SelectList } from 'react-native-dropdown-select-list';
import { useState } from 'react';


const UnitDropdownList = (props) => {
    const [selected, setSelected] = useState('');

    //https://www.npmjs.com/package/react-native-dropdown-select-list
    const units = [
        {key:'1', value:'cup'},
        {key:'2', value:'tbsp'},
        {key:'3', value:'lb'},
        {key:'4', value:'g'},
        {key:'5', value:'item'}
    ]


    return(
        <SelectList
            setSelected={(val) => setSelected(val)}
            data={units}
            save="value"
        />
    )
};


export {UnitDropdownList};
