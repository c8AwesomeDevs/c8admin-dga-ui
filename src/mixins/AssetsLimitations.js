export const assetMixin = {
  created() {
    // console.log("asset mixin loaded");
  },
  data() {
    return {};
  },
  methods: {
    demoElemLimit(elemtype, h) {
      // this method return true if inside the limit
      // and returns a string when outside the limit
      // since were only allowing 1:1:1 elements we only need to check
      // index 0 of arrays; this would be a different story if we have
      // more complicated rules
      switch (elemtype) {
        case "root":
          return h.length >= 1 ? "Only 1 root element is allowed for Demo subscribers" : true;
        case "substation":
          return h[0].children.length >= 1 ? "Only 1 substation per site is allowed for Demo subscribers" : true;
        case "transformer":
          return h[0].children[0].children.length >= 1 ? "Only 1 transformer per substation is allowed for Demo subscribers" : true;
        default:
          return "wrong usage of assetMixin:demoElemLimit()";
      }
    },
    demoDatapointLimit(h, i) {
      // this method return true if inside the limit
      // and returns a string when outside the limit
      // we also validate here the input format
      // date and time input should be proper date and time
      // all other attribute_value should be either an integer or a decimal
      // if (h.length >= 3) return "Only 3 data points is allowed in demo version";

      let thingsToCheck = [
        {
          key: "date",
          pattern: /[0-9]{4}\-[0-9]{2}\-[0-9]{2}/,
          err_msg: "Please define a date",
        },
        {
          key: "time",
          pattern: /[0-9]{2}\:[0-9]{2}/,
          err_msg: "Please define a time",
        },
        {
          key: "acetylene",
          pattern: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
          err_msg: "Invalid acetylene value",
        },
        {
          key: "ethylene",
          pattern: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
          err_msg: "Invalid ethylene value",
        },
        {
          key: "methane",
          pattern: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
          err_msg: "Invalid methane value",
        },
        {
          key: "ethane",
          pattern: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
          err_msg: "Invalid ethane value",
        },
        {
          key: "hydrogen",
          pattern: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
          err_msg: "Invalid hydrogen value",
        },
        {
          key: "oxygen",
          pattern: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
          err_msg: "Invalid oxygen value",
        },
        {
          key: "carbon_monoxide",
          pattern: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
          err_msg: "Invalid carbon monoxide value",
        },
        {
          key: "carbon_dioxide",
          pattern: /^[+]?([0-9]+(?:[\.][0-9]*)?|\.[0-9]+)$/,
          err_msg: "Invalid carbon dioxide value",
        },
      ];

      for (let q = 0; q < thingsToCheck.length; q++) {
        if (i[thingsToCheck[q].key] === undefined) return thingsToCheck[q].err_msg;
        if (i[thingsToCheck[q].key].match(thingsToCheck[q].pattern) === null) return thingsToCheck[q].err_msg;
      }

      return true;
    },
  },
};
