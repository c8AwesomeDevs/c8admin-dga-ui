export const gassesMixin = {
  created() {},
  data() {
    return {
      gasses: {
        acetylene: {
          normal: {
            min: 0,
            max: 5,
          },
          medium: {
            min: 5,
            max: 19,
          },
          critical: {
            min: 19,
            max: 35,
          },
          failure: {
            min: 35,
            max: 450,
          },
        },
        ethylene: {
          normal: {
            min: 0,
            max: 87,
          },
          medium: {
            min: 87,
            max: 270,
          },
          critical: {
            min: 270,
            max: 450,
          },
          failure: {
            min: 450,
            max: 1800,
          },
        },
        methane: {
          normal: {
            min: 0,
            max: 85,
          },
          medium: {
            min: 85,
            max: 135,
          },
          critical: {
            min: 135,
            max: 180,
          },
          failure: {
            min: 180,
            max: 400,
          },
        },
        ethane: {
          normal: {
            min: 0,
            max: 111,
          },
          medium: {
            min: 111,
            max: 210,
          },
          critical: {
            min: 210,
            max: 300,
          },
          failure: {
            min: 301,
            max: 900,
          },
        },
        hydrogen: {
          normal: {
            min: 0,
            max: 118,
          },
          medium: {
            min: 118,
            max: 200,
          },
          critical: {
            min: 200,
            max: 724,
          },
          failure: {
            min: 724,
            max: 1800,
          },
        },
        acetylene_roc: {
          normal: {
            min: 0,
            max: 1,
          },
          medium: {
            min: 1,
            max: 2,
          },
          critical: {
            //   min: 1,
            //   max: 1,
          },
          failure: {
            min: 2,
            max: 15,
          },
        },
        ethylene_roc: {
          normal: {
            min: 0,
            max: 1,
          },
          medium: {
            min: 1,
            max: 2.5,
          },
          critical: {
            min: 2.5,
            max: 11,
          },
          failure: {
            min: 11,
            max: 150,
          },
        },
        methane_roc: {
          normal: {
            min: 0,
            max: 1.3,
          },
          medium: {
            min: 1.3,
            max: 5,
          },
          critical: {
            min: 5,
            max: 11,
          },
          failure: {
            min: 11,
            max: 150,
          },
        },
        ethane_roc: {
          normal: {
            min: 0,
            max: 1.2,
          },
          medium: {
            min: 1.2,
            max: 7,
          },
          critical: {
            min: 7,
            max: 17,
          },
          failure: {
            min: 17,
            max: 330,
          },
        },
        hydrogen_roc: {
          normal: {
            min: 0,
            max: 1.8,
          },
          medium: {
            min: 1.8,
            max: 6,
          },
          critical: {
            min: 6,
            max: 12,
          },
          failure: {
            min: 12,
            max: 90,
          },
        },
      },
    };
  },
  methods: {
    getStatus(gas, value) {
      var details = this.gasses[gas];

      if (value >= details.normal.min && value <= details.normal.max) {
        return "Normal";
      } else if (value > details.medium.min && value <= details.medium.max) {
        return "Medium";
      } else if (value > details.critical.min && value <= details.critical.max) {
        return "Critical";
      } else if (value > details.failure.min) {
        return "Pre-Failure";
      }
    },
  },
};
