/**
 * SQL Server Big Data Cluster API
 * OpenAPI specification for **SQL Server Big Data Cluster**.
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


export class CreateSqlInstanceMessage {
    'namespace'?: string;
    'name'?: string;
    'sysAdminPassword'?: string;
    'vcores'?: string;
    'memory'?: string;

    static discriminator: string | undefined = undefined;

    static attributeTypeMap: Array<{name: string, baseName: string, type: string}> = [
        {
            "name": "namespace",
            "baseName": "namespace",
            "type": "string"
        },
        {
            "name": "name",
            "baseName": "name",
            "type": "string"
        },
        {
            "name": "sysAdminPassword",
            "baseName": "sys_admin_password",
            "type": "string"
        },
        {
            "name": "vcores",
            "baseName": "vcores",
            "type": "string"
        },
        {
            "name": "memory",
            "baseName": "memory",
            "type": "string"
        }    ];

    static getAttributeTypeMap() {
        return CreateSqlInstanceMessage.attributeTypeMap;
    }
}

