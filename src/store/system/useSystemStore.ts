import { create } from 'zustand'

type SystemStoreStateType = {
    mode: 'default' | 'private'
}
type SystemStoreActionType = {
    updateMode: (firstName: SystemStoreStateType['mode']) => void
}

type SystemStoreType  = SystemStoreStateType & SystemStoreActionType

const useSystemStore = create<SystemStoreType>((set) => ({
    mode: 'default',
    updateMode: (mode) => set(() => ({ mode })),
}))

export {
    useSystemStore,
    type SystemStoreType,
    type SystemStoreStateType,
    type SystemStoreActionType,
}