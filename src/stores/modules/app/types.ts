export type EnvVersion = 'develop' | 'trial' | 'release'

export interface AppStore {
  version: string
  wxVersion: string
  envVersion: EnvVersion | ''
}
