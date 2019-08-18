import { useState, useEffect } from "react";
import { IStatus } from '../Types-Interfaces';


export const useApi = () => {
    const [ responsed, newResponse ] = useState<IFetchResponsedData | null>( null );
    const [ isLoading, setIsLoading ] = useState(false);
    const [ FetchData, newFetch ] = useState<{ endpoint: EndpointsTypes, options: RequestInit, urlParams?: string}>();
    const urlPrueba = 'http://10.107.159.43';

    useEffect( () => {
        // console.log({ FetchData });

        if ( FetchData ){
            setIsLoading( true );
            const url =  urlPrueba+'/api/'+FetchData.endpoint+( FetchData.urlParams || '' );
            const options = setDefaultApiOptions(FetchData.endpoint, FetchData.options);
            fetchThis( url, options )
            .then( newRes => newResponse({ ...newRes, endpoint: FetchData.endpoint }) )
            .catch( newError => newResponse({
                response: null,
                endpoint: FetchData.endpoint,
                error: {
                    type: 'Error',
                    message: 
`Fatal error fetching api in ${ FetchData.endpoint }.
Error: ${ String( newError.message || newError ) }`,
                    timeout: 0
                }
            }))
        }
    },[ FetchData ]);

    useEffect( () => {
        // console.log({ isLoading });

        if( isLoading && FetchData ){
            newResponse({ 
                response: null, 
                endpoint: FetchData.endpoint,
                error: {
                    type: 'Loading',
                    message: `Loading fetch api: ${ FetchData.endpoint }`,
                    timeout: 0
                }
            });
        }
    },[ isLoading ])

    useEffect( () => {
        // console.log({ responsed });

        if( responsed ){
            newFetch( undefined );
            if( responsed.error && responsed.error.type !== 'Loading' ){
                setIsLoading( false )
            }
        }
    },[ responsed ])

    return { responsed, isLoading, newFetch };
}

export type EndpointsTypes = 'authentication/signup/' |
'authentication/login/' |
'authentication/read/' |
'authentication/getuser/email/' |
'projects/create/' |
'projects/read/' |
'projects/update/' |
'projects/delete/' |
'projects/ticket/' |
'items/equipment/create/' |
'items/equipment/read/' |
'items/equipment/update/' |
'items/equipment/delete/' |
'items/equipment/get/' |
'itemslog/equipment/take/' |
'itemslog/equipment/read/' |
'itemslog/equipment/update/' |
'itemslog/equipment/delete/' |
'itemslog/equipment/get/' |
'items/consumable/create/' |
'items/consumable/read/' |
'items/consumable/update/' |
'items/consumable/delete/' |
'items/consumable/get/' |
'itemslog/consumable/take/' |
'itemslog/consumable/read/' |
'itemslog/consumable/update/' |
'itemslog/consumable/delete/';

export interface IFetchResponsedData {
    response: Response & { jsonParsed: any } | null,
    url?: string,
    endpoint?: EndpointsTypes,
    error?: IStatus['validation']
}

export const fetchThis = async ( url: string, options?: RequestInit ) => {
    let fetchData: IFetchResponsedData = {
        response: null,
        url,
        error: {
            type: 'Warn',
            message: 'Loading fetch',
            timeout: 0,
        }
    }

    try {
        const res = await fetch(url, options);
        const json = await res.json();
        fetchData.response = {
            ...res,
            jsonParsed: json
        }
        fetchData.error = {
            type: 'Success',
            message: String( res.statusText || `Successfully fetch of ${url}`),
            timeout: 5000,
        }
    } catch (error) {
        fetchData.error = {
            type: 'Error',
            message: String( error.message || error || `Fatal error fetching: ${url}`),
            timeout: 0
        };
    }
    return fetchData;
}

export const setDefaultApiOptions = ( endpoint: EndpointsTypes, options: RequestInit ) => {
    if( 
        [ 'authentication/getuser/email/'
        , 'authentication/read/'
        , 'projects/read/'
        , 'projects/ticket/'
        , 'items/equipment/get/'
        , 'items/equipment/read/'
        , 'items/consumable/get/'
        , 'items/consumable/read/'
        , 'itemslog/equipment/read/'
        , 'itemslog/consumable/read/']
        .includes( endpoint ) 
    ){
        options.method = 'GET';
    }

    if ( 
        [ 'authentication/signup/'
        , 'authentication/login/'
        , 'projects/create/'
        , 'projects/delete/'
        , 'items/consumable/create/'
        , 'items/consumable/update/'
        , 'items/consumable/delete/'
        , 'itemslog/equipment/take/'
        , 'itemslog/equipment/update/'
        , 'itemslog/equipment/delete/'
        , 'items/consumable/create/'
        , 'items/consumable/update/'
        , 'items/consumable/delete/'
        , 'itemslog/consumable/take/'
        , 'itemslog/consumable/update/'
        , 'itemslog/consumable/delete/']
        .includes( endpoint ) 
    ){
        options.method = 'POST';
    }

    if(
        ['authentication/signup/'
        , 'authentication/login/'
        , 'projects/update/'
        , 'projects/delete/'
        , 'itemslog/equipment/take/'
        , 'itemslog/equipment/update/'
        , 'itemslog/equipment/delete/'
        , 'items/consumable/create/'
        , 'items/consumable/update/'
        , 'items/consumable/delete/'
        , 'itemslog/consumable/take/'
        , 'itemslog/consumable/update/'
        , 'itemslog/consumable/delete/']
        .includes( endpoint )     
    ){
        options.headers = {
            'content-type': 'application/json'
        };
    }
    if(
        ['authentication/read/' 
        , 'projects/ticket/']
        .includes( endpoint )
    ){
        options.headers = {
            ...options.headers // Authorization: bearer;
        };
        options.credentials = 'include';
    }
    if( 'projects/create/' === endpoint ){
        options.headers = {
            ...options.headers, // Authorization: bearer;
            'content-type': 'application/json'
        };
        options.credentials = 'include';
    }
    return options;
}