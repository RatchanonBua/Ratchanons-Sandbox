const { WebhookClient } = require('dialogflow-fulfillment');

const processDialogflowHook = async (payload, request, response) => {
  const agent = new WebhookClient({ request, response });
  // Intent Function
  function bodyMassIndex(agent) {
    let weight = parseFloat(agent.parameters.weight || 0);
    let height = parseFloat(agent.parameters.height || 0) / 100;
    let result = 'ขอโทษครับ ผมไม่เข้าใจคำถาม';
    if (weight > 0 && height > 0) {
      const bmi = (weight / (height * height)).toFixed(2);
      result = `BMI ของคุณคือ ${bmi}\n`;
      if (bmi <= 18.5) {
        result = result + `คุณผอมเกินไปนะ`;
      } else if (bmi <= 23) {
        result = result + `คุณสมส่วนแล้วล่ะ`;
      } else if (bmi <= 25) {
        result = result + `คุณเริ่มจะอ้วนแล้ว`;
      } else if (bmi <= 30) {
        result = result + `คุณอ้วนแล้วล่ะนะ`;
      } else {
        result = result + `คุณอ้วนเกินไปแล้ว`;
      }
    }
    agent.add(result);
  }
  // Intent Mapping
  let intentMap = new Map();
  intentMap.set('Body Mass Index - custom - yes', bodyMassIndex);
  agent.handleRequest(intentMap);
};

module.exports = { processDialogflowHook }