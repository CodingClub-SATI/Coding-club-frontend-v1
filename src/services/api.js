export const statsApi = {
  get: async () => {
    // Mock data to prevent build/runtime crashes
    return {
      totalEvents: 0,
      activeMembers: 0,
      studentProjects: 0
    };
  }
};