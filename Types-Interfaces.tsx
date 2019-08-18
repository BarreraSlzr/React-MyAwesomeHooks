
export interface IAllState {
    User?: {
        Info?: IBasicUserInfo & {
            user: {
                _departament: string,
                _cost_center: string,
                _location: string,
                _domain: string,
                _username: string,
            }
            profile_type: string
        },
        Session?: {
            token: string
        }
        Projects?: IProject[],
        Certifications?: ICertification[],
    },
    Inventory?: {
        Consumables: Map<IConsumable['serial'], IConsumable>,
        Equipaments: Map<IEquipament['serial'], IEquipament>,
        Projects?: Map<IProject['serial'], IProject>
    },
    Configuration: {
        MainStatus: IStatus['validation']
    }
}

export interface IProject extends IItemData {
    manager_email:  string,
    chef: string,
    status: number,
    members: string[],
    date: {
        expiration: string,
        init?: string
    }
    history?: {
        message: string,
        id: { user: string }
        time: { created: string }
    }[]
}

export interface IOrderData {
    id: {
        item: {
            serial?: string,
            name?: string,
            description?: string
        },
        project: {
            serial?: number,
            name?: string
        }
        user: {
            email?: string,
            name?: string
        },
    },
    amount: number,
    time?: {
        returned?: string
        created: string
    }
}

export interface IBasicUserInfo {
    email: string,
    name: {
        first: string,
        last?: string,
        full: string
    }
}

export interface IItemData {
    serial: string,
    name: string,
    description: string
}
export interface ICertification extends IItemData {
    date: {
        expiration: string
    }
}
export interface IEquipament extends IItemData{
    type: string,
    stock: {
        actual: number
    }
};
export interface IConsumable extends IItemData {
    stock: {
        actual: number,
        minimal: number
    },
    type: string,
    price: IPrice
}


// Global Interfaces

export interface IPrice {
    unit: number,
    currency: 'EUR' | 'MXN' | 'USD';
}

export interface IStatus {
    validation: {
        type: '' | 'Success' | 'Error' | 'Normal' | 'Warn' | 'Loading',
        message: string,
        timeout: number
    };
}