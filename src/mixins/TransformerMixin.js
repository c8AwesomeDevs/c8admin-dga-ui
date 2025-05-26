export const transformerMixin = {
  created() {
    // console.log("asset mixin loaded");
  },
  data() {
    return {};
  },
  methods: {
    validateTransformerDetails(i) {
      // this method return true if inside the limit
      // and returns a string when outside the limit
      let thingsToCheck = [
        {
          key: "manufacturer",
          err_msg: "Please provide Manufacturer",
        },
        {
          key: "insulation_type",
          err_msg: "Please provide Transformer insulation type",
        },
        {
          key: "oil_type",
          err_msg: "Please provide Transformer oil type",
        },
        {
          key: "startup_date",
          err_msg: "Please select Commisioning date",
        },
        {
          key: "construction_year",
          err_msg: "Please provide Construction year",
        },
        {
          key: "line_capacity",
          err_msg: "Please provide Line capacity",
        },
        {
          key: "winding_voltage",
          err_msg: "Please provide Winding voltage",
        },
        {
          key: "volt_capacity",
          err_msg: "Please provide Voltage Capacity",
        },
        {
          key: "address",
          err_msg: "Please provide Address",
        },
        {
          key: "country_manufacturer",
          err_msg: "Please provide Country manufacturer",
        },
        {
          key: "serial_no",
          err_msg: "Please provide Serial number",
        },
        {
          key: "model_no",
          err_msg: "Please provide Model number",
        },
       
      ];

      for (let q = 0; q < thingsToCheck.length; q++) {
        if (i[thingsToCheck[q].key] === null || i[thingsToCheck[q].key] === undefined || i[thingsToCheck[q].key] === "") return thingsToCheck[q].err_msg;
      }

      return true;
    },
  },
};
