export const subscriptionMixin = {
  created() {},
  data() {
    return {
      subscriptions: {
        demo: {
          price: "1 month FREE",
          inclusions: [
            "1 Month Free Trial", // not a positive feature for user
            "3 historical datapoints", // not a positive feature for user
            "Dornenburg Ratio",
            "IEC Ratio",
            "Roger's Ratio",
            "Duval's Triangles 1-7",
            "Duval's Pentagon 1-2",
            // "1 User", // not a positive feature for user
            // "1 Asset", // not a positive feature for user
          ],
        },

        advanced: {
          price: "$30 monthly + $20 per datapoint",
          price_id: "price_1NxoyDCZNXCcEtKRI2cFgYM0",
          inclusions: [
            // "4 users/Asset", // not a positive feature for user
            // "Usage-based billing", // not a positive feature for user
            "Unlimited datapoints",
            "Free 5 historical datapoints",
            "Dornenburg Ratio",
            "IEC Ratio",
            "Roger's Ratio",
            "Duval's Triangles 1-7",
            "Duval's Pentagon 1-2",
          ],
        },
        // basic : {
        //     price : '$500',
        //     price_id : 'price_1MbkzoCZNXCcEtKRz979VArd',
        //     inclusions : [
        //         'Yearly Subscription',
        //         '4 users/Asset',
        //         'Dornenburg Ratio',
        //         'IEC Ratio',
        //         'Roger\'s Ratio',
        //         'Duval\'s Triangle 1',
        //         'Unlimited datapoints',
        //         'Unlimited assets'
        //     ]
        // },
      },
    };
  },
};
