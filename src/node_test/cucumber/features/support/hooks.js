/**
 * @function
 *
 * Hooks can be used to prepare and clean
 * the environment before and after
 * each scenario is executed
 */
module.exports = function() {
    /**
     * To run something before every scenario,
     * use before hooks
     *
     * @param  {Function} callback a done callback from cucumber.js
     */
    this.Before(function(scenario, callback) {

        //don't forget to tell cucumber when your done
        callback();
    });


    /**
     * To run something after every scenario,
     * use after hooks
     *
     * @param  {Function} callback a done callback from cucumber.js
     */
    this.After(function(scenario, callback) {

        //don't forget to tell cucumber when your done
        callback();
    });
}