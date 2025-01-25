enum WorkMode {
  HYBRID = 'hybrid',
  REMOTE = 'remote',
  ONSITE = 'on-site'
}

export const workModeMap = {
  0: WorkMode.HYBRID,
  1: WorkMode.REMOTE,
  2: WorkMode.ONSITE
}

export default WorkMode;