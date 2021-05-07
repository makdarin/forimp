function ElementController($scope, $http) {
	console.log('ELEMENT CONTROLLER');
	$scope.loginProfiles = [];
	$scope.loginProfilesById = {};
	$scope.typegroups = [];
	$scope.partnerGroups = [];
	$scope.elements = [];
	$scope.elementsById = {};
	$scope.typegroupId = 0;
	$scope.partnerGroupId = 0;
	$scope.newElement = null;
	$scope.relations = [];
	$scope.savingRelations = false;


	$scope.pgName = function (partnerGroup) {
		return partnerGroup.PG_NAME + ' (' + partnerGroup.PG_ID + ')';
	};

	$scope.tgName = function (typeGroup) {
		return typeGroup.TG_EXTERNALID + ' (' + typeGroup.TG_ID + ')';
	};

	$scope.getLoginProfileById = function (profileId) {
		profileId = parseInt(profileId, 10);
		if ($scope.loginProfilesById[profileId]) return $scope.loginProfilesById[profileId];
		return {};
	};

	$scope.getElementShort = function (element) {
		switch (element.ELEMENT_TYPE) {
			case 'LOGINPROFILE':
				return 'Login: ' + $scope.getLoginProfileById(element.ELEMENT_VALUE).LP_NAME;
			case 'HTML':
				return 'HTML: ' + element.ELEMENT_NAME;
			case 'ITEM':
				return 'ITEM: ' + element.ELEMENT_NAME;
			default:
				return 'Unknown Element';
		}

	};

	$scope.getElementTitle = function (element) {
		switch (element.ELEMENT_TYPE) {
			case 'LOGINPROFILE':
				return 'Login: ' + element.ELEMENT_NAME;
			case 'HTML':
				return 'HTML: ' + element.ELEMENT_NAME;
			case 'ITEM':
				return 'ITEM: ' + element.ELEMENT_NAME;
			default:
				return 'Unknown: ' + element.ELEMENT_NAME;
		}
	};

	$scope.getElementValue = function (element) {
		switch (element.ELEMENT_TYPE) {
			case 'LOGINPROFILE':
				return $scope.getLoginProfileById(element.ELEMENT_VALUE).LP_NAME;
			case 'HTML':
				return element.ELEMENT_VALUE;
			case 'ITEM':
				return element.ELEMENT_VALUE;
			default:
				return 'Unknown Element';
		}
	};

	$scope.addElement = function () {
		$scope.relations.push({
			PG_ID: $scope.partnerGroupId,
			TG_ID: $scope.typegroupId,
			ELEMENT_ID: $scope.newElement.ELEMENT_ID,
			ELEMENT_SORTVALUE: 0
		});
	};

	$scope.moveUp = function (el) {
		var cur = $scope.relations.indexOf(el);
		var tmp = $scope.relations.splice(cur, 1);
		$scope.relations.splice(cur - 1, 0, tmp[0]);
	};

	$scope.moveDown = function (el) {
		var cur = $scope.relations.indexOf(el);
		var tmp = $scope.relations.splice(cur, 1);
		$scope.relations.splice(cur + 1, 0, tmp[0]);
	};

	$scope.saveRelations = function (btn) {
		$scope.savingRelations = true;
		var put = [];
		$scope.relations.forEach(function (rel, i) {
			put.push(rel.ELEMENT_ID);
		});
		$http({ method: 'POST', url: '/api/tools/v1/elementRelations/' + $scope.partnerGroupId + '/' + $scope.typegroupId, data: put }).success(function () {
			console.log('Done saving');
			$scope.savingRelations = false;
		}).error(function () {
			console.log('Error saving');
			$scope.savingRelations = false;
		});
	};

	$scope.removeRel = function (el) {
		var cur = $scope.relations.indexOf(el);
		var tmp = $scope.relations.splice(cur, 1);
	};

	// Initialize
	var update = function () {
		$http.get('/api/tools/v1/elements').success(function(data) {
			$scope.elements = data;
			data.forEach(function (e) {
				$scope.elementsById[e.ELEMENT_ID] = e;
			});
		});
		$http.get('/api/tools/v1/loginProfiles').success(function(data) {
			$scope.loginProfiles = data;
			data.forEach(function (e) {
				$scope.loginProfilesById[e.LP_ID] = e;
			});
		});
		$http.get('/api/tools/v1/typegroups').success(function(data) {
			$scope.typegroups = data;
		});
		$http.get('/api/tools/v1/partnerGroups').success(function(data) {
			$scope.partnerGroups = data;
		});
		$scope.loadRelations();
	};

	$scope.loadRelations = function () {
		$scope.typegroupId |= 0;
		$scope.partnerGroupId |= 0;
		$http.get('/api/tools/v1/elementRelations/' + $scope.partnerGroupId + '/' + $scope.typegroupId).success(function(data) {
			$scope.relations = data;
		});
	};

	update();
};