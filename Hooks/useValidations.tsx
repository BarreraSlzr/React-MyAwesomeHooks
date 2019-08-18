import { useState, useEffect } from "react";
import { IStatus } from "../Types-Interfaces";


// export const firstUppercaseOf = ( s: string ) => s.charAt(0).toLocaleUpperCase()+s.slice(1);


export const classNameFromValidity = (validities: [string, boolean][]) =>{
    return validities.reduce( (prev, validation ) => {   
        if ( validation[1] ){ return prev+' '+validation[0]; }
        return prev;
      },'');
    }


export const useInputValidation = ( defaultValidationInput: IStatus['validation'] ) => {
    const [ ClassName, setClassName ] = useState();
    const [ ValidationStatus, SetValidation ] = useState( defaultValidationInput );
    const [ InputRef, CheckThisInput ] = useState<{ 
        validity: HTMLInputElement['validity'],
        validationMessage: HTMLInputElement['validationMessage'],
        value: HTMLInputElement['value']
     }>()
    const [ Validity, setValidity ] = useState< ValidityState >();

    const isIdetical = (left: any, rigth: any) => Object
        .values( left )
        .toString() === Object.values( rigth ).toString()
    
    useEffect( () => {
        if( InputRef ){ 
            // console.log({ InputRef });
            // console.log({ ValidationStatus });
            // console.log({ Validity });
            
            if( InputRef.validity ){
                const currentValidities = {
                    isBadInput: InputRef.validity.badInput,
                    hadError: InputRef.validity.customError,
                    hadPatternMismatch: InputRef.validity.patternMismatch,
                    hadRangeOverflow: InputRef.validity.rangeOverflow,
                    hadRangeUnderflow: InputRef.validity.rangeUnderflow,
                    hadStepMismatch: InputRef.validity.stepMismatch,
                    isTooLong: InputRef.validity.tooLong,
                    isTooShort: InputRef.validity.tooShort,
                    TypeMismatch: InputRef.validity.typeMismatch,
                    isEmpty: InputRef.validity.valueMissing || InputRef.value == "",
                    isValid: InputRef.validity.valid,
                }; 
                const validities:  [string, boolean][] = Object.entries( currentValidities );
                setClassName( classNameFromValidity( validities ) );
            }
            setValidity( InputRef.validity );
            if( InputRef.validationMessage !== ValidationStatus.message ){
                let newValidation: IStatus['validation'] = {
                    ...ValidationStatus,
                    message: InputRef.validationMessage,
                    timeout: 0
                };
                if( Validity && Validity.valid ){
                    if( newValidation.message.length ){
                        newValidation.type = 'Warn';
                    } else {
                        newValidation.type = 'Success';
                        newValidation.timeout = 5000;
                    }
                } else {
                    newValidation.type = 'Warn';
                }
                if ( !isIdetical( newValidation, ValidationStatus ) ){
                    SetValidation({ ...ValidationStatus, type: 'Normal' });
                    setTimeout( () => {
                        SetValidation( newValidation );
                    }, 200); 
                } 
            }
            CheckThisInput(undefined)
        }
    }, [ InputRef, Validity, ValidationStatus ]);
    
    return {
        className: ClassName,
        validity: Validity, 
        check: ( input: HTMLInputElement )=> CheckThisInput({
            validity: input.validity,
            validationMessage: input.validationMessage,
            value: input.value
        }), 
        validation: ValidationStatus,
        new: 
        {   
            validation: SetValidation,
            validity: setValidity,
            className: setClassName
        } 
    }
} 
  