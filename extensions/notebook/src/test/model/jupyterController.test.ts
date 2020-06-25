/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the Source EULA. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as azdata from 'azdata';
import * as vscode from 'vscode';
import * as should from 'should';
import * as TypeMoq from 'typemoq';

import { ApiWrapper } from '../../common/apiWrapper';
import { AppContext } from '../../common/appContext';
import { JupyterController } from '../../jupyter/jupyterController';
import { LocalPipPackageManageProvider } from '../../jupyter/localPipPackageManageProvider';
import { MockExtensionContext } from '../common/stubs';

describe('JupyterController tests', function () {
	let mockExtensionContext: vscode.ExtensionContext;
	let appContext: AppContext;
	let controller: JupyterController;
	let mockApiWrapper: TypeMoq.IMock<ApiWrapper>;
	let connection: azdata.connection.ConnectionProfile;

	this.beforeAll(() => {
		mockExtensionContext = new MockExtensionContext();
		connection  = new azdata.connection.ConnectionProfile();
	});

	this.beforeEach(() => {
		mockApiWrapper = TypeMoq.Mock.ofType<ApiWrapper>();
		mockApiWrapper.setup(x => x.getCurrentConnection()).returns(() => { return Promise.resolve(connection); });
		appContext = new AppContext(mockExtensionContext, mockApiWrapper.object);
		controller = new JupyterController(appContext);
	});

	it('should activate new JupyterController successfully', async () => {
		should(controller.extensionContext).deepEqual(appContext.extensionContext, 'Extension context should be passed through');
		should(controller.jupyterInstallation).equal(undefined, 'JupyterInstallation should be undefined before controller activation');
		await should(controller.activate()).not.be.rejected();
		// On activation, local pip and local conda package providers should exist
		should(controller.packageManageProviders.size).equal(2, 'Local pip and conda package providers should be default providers');
		should(controller.jupyterInstallation.extensionPath).equal(appContext.extensionContext.extensionPath, 'JupyterInstallation extension path should match appContext extension path');
	});

	it('should create new packageManageProvider successfully', async () => {
		should(controller.packageManageProviders.size).equal(0, 'No package manage providers should exist before activate');
		let mockProvider = TypeMoq.Mock.ofType(LocalPipPackageManageProvider);
		controller.registerPackageManager('provider1', mockProvider.object);
		should(controller.packageManageProviders.size).equal(1, 'Package manage providers should equal 1 after one provider added');
	});

	it('should throw when same packageManageProvider added twice', async () => {
		let mockProvider = TypeMoq.Mock.ofType(LocalPipPackageManageProvider);
		controller.registerPackageManager('provider1', mockProvider.object);
		should(controller.packageManageProviders.size).equal(1, 'Package manage providers should equal 1 after one provider added');
		should.throws(() => controller.registerPackageManager('provider1', mockProvider.object));
		should(controller.packageManageProviders.size).equal(1, 'Package manage providers should still equal 1');
	});

	it('should should get defaultConnection() successfully', async () => {
		let defaultConnection = await controller.getDefaultConnection();
		should(defaultConnection).deepEqual(connection, 'getDefaultConnection() did not return expected result');
	});

	it('should show error message for doManagePackages before activation', async () => {
		await controller.doManagePackages();
		mockApiWrapper.verify(x => x.showErrorMessage(TypeMoq.It.isAny()), TypeMoq.Times.once());
	});

	it('should not show error message for doManagePackages after activation', async () => {
		await controller.activate();
		await controller.doManagePackages();
		mockApiWrapper.verify(x => x.showErrorMessage(TypeMoq.It.isAny()), TypeMoq.Times.never());
	});
});
