import TransportOperator from '../models/TransportOperator.js'

export default {
    newOperator(operatorData) {
        const operator = new TransportOperator(operatorData);

        return operator.save();
    },
    getAll() {
        const operators = TransportOperator.find();

        return operators;
    }
}