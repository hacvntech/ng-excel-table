/*
* @Author: Duc Anh Nguyen
* @Email: anhnd@hacvntech.com
* @LinkedIn: https://www.linkedin.com/in/duc-anh-nguyen-31173552
* @Date:   2016-04-11 14:45:02
* @Last Modified by:   Duc Anh Nguyen
* @Last Modified time: 2016-04-11 15:03:50
*/
describe('Begin test', function () {

	beforeEach(module('excel-table'));

    describe('ExcelTableController running...', function () {
    	it('z should have default value of zero', inject(function ($controller, $rootScope) {
			var scope = $rootScope.$new();
			var controller = $controller('ExcelTableController', { $scope: scope });
			expect(scope.z).toBe(2);
		}));
    });
});