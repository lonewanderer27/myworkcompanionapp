enum WorkMode {
  HYBRID = 'hybrid',
  REMOTE = 'remote',
  ONSITE = 'on-site'
}

export const workModeMap = {
  1: WorkMode.HYBRID,
  2: WorkMode.REMOTE,
  3: WorkMode.ONSITE
}

export default WorkMode;