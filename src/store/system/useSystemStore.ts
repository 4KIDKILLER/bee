import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type SystemStoreStateType = {
    mode: 'default' | 'private'
}
type SystemStoreActionType = {
    updateMode: (firstName: SystemStoreStateType['mode']) => void
}

type SystemStoreType = SystemStoreStateType & SystemStoreActionType

const useSystemStore = create<SystemStoreType>()(
    persist(
        (set) => ({
            mode: 'default',
            updateMode: (mode) => set(() => ({ mode })),
        }),
        {
            name: 'system-storage', // name of the item in the storage (must be unique)
            storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
        },
    )
)

export {
    useSystemStore,
    type SystemStoreType,
    type SystemStoreStateType,
    type SystemStoreActionType,
}