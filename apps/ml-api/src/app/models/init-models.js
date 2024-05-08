var DataTypes = require('sequelize').DataTypes;
var _account = require('./account');
var _activity = require('./activity');
var _activity_type = require('./activity_type');
var _category = require('./category');
var _class_ = require('./class');
var _crises_management = require('./crises_management');
var _crises_management_flow = require('./crises_management_flow');
var _device = require('./device');
var _device_type = require('./device_type');
var _enrollment = require('./enrollment');
var _feedback = require('./feedback');
var _filtered_category = require('./filtered_category');
var _filtered_url = require('./filtered_url');
var _group = require('./group');
var _group_permission = require('./group_permission');
var _message_template = require('./message_template');
var _organization_unit = require('./organization_unit');
var _permission = require('./permission');
var _prr_content = require('./prr_content');
var _user = require('./user');
var _user_device = require('./user_device');
var _user_group = require('./user_group');

function initModels(sequelize) {
    var account = _account(sequelize, DataTypes);
    var activity = _activity(sequelize, DataTypes);
    var activity_type = _activity_type(sequelize, DataTypes);
    var category = _category(sequelize, DataTypes);
    var SchoolClass = _class_(sequelize, DataTypes);
    var crises_management = _crises_management(sequelize, DataTypes);
    var crises_management_flow = _crises_management_flow(sequelize, DataTypes);
    var device = _device(sequelize, DataTypes);
    var device_type = _device_type(sequelize, DataTypes);
    var enrollment = _enrollment(sequelize, DataTypes);
    var feedback = _feedback(sequelize, DataTypes);
    var filtered_category = _filtered_category(sequelize, DataTypes);
    var FilteredUrl = _filtered_url(sequelize, DataTypes);
    var group = _group(sequelize, DataTypes);
    var group_permission = _group_permission(sequelize, DataTypes);
    var message_template = _message_template(sequelize, DataTypes);
    var OrganizationUnit = _organization_unit(sequelize, DataTypes);
    var permission = _permission(sequelize, DataTypes);
    var prr_content = _prr_content(sequelize, DataTypes);
    var user = _user(sequelize, DataTypes);
    var user_device = _user_device(sequelize, DataTypes);
    var user_group = _user_group(sequelize, DataTypes);

    device.belongsToMany(user, { as: 'users_id_users', through: user_device, foreignKey: 'devices_id', otherKey: 'users_id' });
    device_type.belongsToMany(OrganizationUnit, {
        as: 'organization_unit_id_organization_units',
        through: device,
        foreignKey: 'device_types_id',
        otherKey: 'organization_unit_id',
    });
    group.belongsToMany(permission, { as: 'permission_id_permissions', through: group_permission, foreignKey: 'groups_id', otherKey: 'permission_id' });
    group.belongsToMany(user, { as: 'user_id_users', through: user_group, foreignKey: 'group_id', otherKey: 'user_id' });
    OrganizationUnit.belongsToMany(device_type, {
        as: 'device_types_id_device_types',
        through: device,
        foreignKey: 'organization_unit_id',
        otherKey: 'device_types_id',
    });
    permission.belongsToMany(group, { as: 'groups_id_groups', through: group_permission, foreignKey: 'permission_id', otherKey: 'groups_id' });
    user.belongsToMany(device, { as: 'devices_id_devices', through: user_device, foreignKey: 'users_id', otherKey: 'devices_id' });
    user.belongsToMany(group, { as: 'group_id_groups', through: user_group, foreignKey: 'user_id', otherKey: 'group_id' });
    OrganizationUnit.belongsTo(account, { as: 'account', foreignKey: 'account_id' });
    account.hasMany(OrganizationUnit, { as: 'organization_units', foreignKey: 'account_id' });
    user.belongsTo(account, { as: 'account', foreignKey: 'account_id' });
    account.hasMany(user, { as: 'users', foreignKey: 'account_id' });
    activity.belongsTo(activity_type, { as: 'activity_type', foreignKey: 'activity_types_id' });
    activity_type.hasMany(activity, { as: 'activities', foreignKey: 'activity_types_id' });
    activity.belongsTo(category, { as: 'category', foreignKey: 'category_id' });
    category.hasMany(activity, { as: 'activities', foreignKey: 'category_id' });
    activity.belongsTo(SchoolClass, { as: 'class', foreignKey: 'class_id' });
    SchoolClass.hasMany(activity, { as: 'activities', foreignKey: 'class_id' });
    enrollment.belongsTo(SchoolClass, { as: 'class', foreignKey: 'class_id' });
    SchoolClass.hasMany(enrollment, { as: 'enrollments', foreignKey: 'class_id' });
    crises_management_flow.belongsTo(crises_management, { as: 'crises_management', foreignKey: 'crises_management_id' });
    crises_management.hasMany(crises_management_flow, { as: 'crises_management_flows', foreignKey: 'crises_management_id' });
    user_device.belongsTo(device, { as: 'device', foreignKey: 'devices_id' });
    device.hasMany(user_device, { as: 'user_devices', foreignKey: 'devices_id' });
    device.belongsTo(device_type, { as: 'device_type', foreignKey: 'device_types_id' });
    device_type.hasMany(device, { as: 'devices', foreignKey: 'device_types_id' });
    group_permission.belongsTo(group, { as: 'group', foreignKey: 'groups_id' });
    group.hasMany(group_permission, { as: 'group_permissions', foreignKey: 'groups_id' });
    user_group.belongsTo(group, { as: 'group', foreignKey: 'group_id' });
    group.hasMany(user_group, { as: 'user_groups', foreignKey: 'group_id' });
    crises_management_flow.belongsTo(message_template, { as: 'message_template', foreignKey: 'message_template_id' });
    message_template.hasMany(crises_management_flow, { as: 'crises_management_flows', foreignKey: 'message_template_id' });
    crises_management.belongsTo(OrganizationUnit, { as: 'org_unit', foreignKey: 'org_unit_id' });
    OrganizationUnit.hasMany(crises_management, { as: 'crises_managements', foreignKey: 'org_unit_id' });
    device.belongsTo(OrganizationUnit, { as: 'organization_unit', foreignKey: 'organization_unit_id' });
    OrganizationUnit.hasMany(device, { as: 'devices', foreignKey: 'organization_unit_id' });
    enrollment.belongsTo(OrganizationUnit, { as: 'school', foreignKey: 'school_id' });
    OrganizationUnit.hasMany(enrollment, { as: 'enrollments', foreignKey: 'school_id' });
    filtered_category.belongsTo(OrganizationUnit, { as: 'org_unit', foreignKey: 'org_unit_id' });
    OrganizationUnit.hasMany(filtered_category, { as: 'filtered_categories', foreignKey: 'org_unit_id' });
    FilteredUrl.belongsTo(OrganizationUnit, { as: 'org_unit', foreignKey: 'org_unit_id' });
    OrganizationUnit.hasMany(FilteredUrl, { as: 'filtered_urls', foreignKey: 'org_unit_id' });
    OrganizationUnit.belongsTo(OrganizationUnit, { as: 'parent_ou', foreignKey: 'parent_ou_id' });
    OrganizationUnit.hasMany(OrganizationUnit, { as: 'organization_units', foreignKey: 'parent_ou_id' });
    user.belongsTo(OrganizationUnit, { as: 'orgunit', foreignKey: 'orgunit_id' });
    OrganizationUnit.hasMany(user, { as: 'users', foreignKey: 'orgunit_id' });
    group_permission.belongsTo(permission, { as: 'permission', foreignKey: 'permission_id' });
    permission.hasMany(group_permission, { as: 'group_permissions', foreignKey: 'permission_id' });
    enrollment.belongsTo(user, { as: 'student', foreignKey: 'student_id' });
    user.hasMany(enrollment, { as: 'enrollments', foreignKey: 'student_id' });
    enrollment.belongsTo(user, { as: 'teacher', foreignKey: 'teacher_id' });
    user.hasMany(enrollment, { as: 'teacher_enrollments', foreignKey: 'teacher_id' });
    user_device.belongsTo(user, { as: 'user', foreignKey: 'users_id' });
    user.hasMany(user_device, { as: 'user_devices', foreignKey: 'users_id' });
    user_group.belongsTo(user, { as: 'user', foreignKey: 'user_id' });
    user.hasMany(user_group, { as: 'user_groups', foreignKey: 'user_id' });
    activity.belongsTo(user_device, { as: 'device', foreignKey: 'device_id' });
    user_device.hasMany(activity, { as: 'activities', foreignKey: 'device_id' });
    activity.belongsTo(user_device, { as: 'user', foreignKey: 'user_id' });
    user_device.hasMany(activity, { as: 'user_activities', foreignKey: 'user_id' });
    feedback.belongsTo(user_device, { as: 'device', foreignKey: 'device_id' });
    user_device.hasMany(feedback, { as: 'feedbacks', foreignKey: 'device_id' });
    feedback.belongsTo(user_device, { as: 'user', foreignKey: 'user_id' });
    user_device.hasMany(feedback, { as: 'user_feedbacks', foreignKey: 'user_id' });

    return {
        account,
        activity,
        activity_type,
        category,
        class_: SchoolClass,
        crises_management,
        crises_management_flow,
        device,
        device_type,
        enrollment,
        feedback,
        filtered_category,
        filtered_url: FilteredUrl,
        group,
        group_permission,
        message_template,
        organization_unit: OrganizationUnit,
        permission,
        prr_content,
        user,
        user_device,
        user_group,
    };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
