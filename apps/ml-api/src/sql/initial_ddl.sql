create table account_type
(
    id   varchar(255) not null
        primary key,
    type varchar(20)  not null
);

create table activity_type
(
    id   varchar(30) not null
        primary key,
    name varchar(60) null,
    constraint id
        unique (id)
);

create table category
(
    id            varchar(255) not null
        primary key,
    name          varchar(150) not null,
    enabled       tinyint(1)   not null,
    schoolDefault tinyint(1)   not null,
    editable      tinyint(1)   not null,
    status        varchar(50)  not null,
    time_duration int          null,
    constraint name
        unique (name)
);

create table coupon
(
    id         varchar(255)                not null
        primary key,
    code       varchar(255)                not null,
    status     enum ('ACTIVE', 'INACTIVE') not null,
    created_at datetime                    not null,
    updated_at datetime                    not null,
    deleted_at datetime                    null
);

create table device_type
(
    id   varchar(255) not null
        primary key,
    name varchar(45)  null
);

create table email_event_type
(
    id   varchar(50) not null
        primary key,
    type varchar(50) not null,
    constraint type
        unique (type)
);

create table email_ml_feedback
(
    id              char(36) collate utf8mb4_bin not null
        primary key,
    email_date_time datetime                     not null,
    from_name       varchar(255)                 null,
    from_email      varchar(320)                 not null,
    to_name         varchar(255)                 null,
    to_email        varchar(320)                 not null,
    cc_email        varchar(955)                 null,
    subject         varchar(955)                 not null,
    body            varchar(5000)                not null,
    thread_id       varchar(200)                 null,
    ext_version     varchar(25)                  null,
    ml_version      varchar(25)                  null,
    created_at      datetime                     null,
    updated_at      datetime                     null,
    deleted_at      datetime                     null,
    constraint id
        unique (id)
);

create table health
(
    id   char(36) collate utf8mb4_bin not null
        primary key,
    name varchar(255)                 not null
);

create table internal_api_key
(
    service    varchar(255) not null
        primary key,
    `key`      varchar(150) not null,
    created_at datetime     null,
    updated_at datetime     null,
    constraint service
        unique (service)
);

create table license
(
    id        varchar(255)         not null
        primary key,
    name      varchar(200)         null,
    enabled   tinyint(1) default 1 not null,
    createdAt datetime             not null,
    updatedAt datetime             not null,
    constraint id
        unique (id)
);

create table onboarding_step
(
    id          int         not null
        primary key,
    step        varchar(20) not null,
    description varchar(50) null,
    createdAt   datetime    not null,
    updatedAt   datetime    not null
);

create table organization_unit
(
    id                     char(36) collate utf8mb4_bin not null
        primary key,
    google_org_unit_id     varchar(200)                 null,
    name                   varchar(45)                  null,
    parent                 varchar(255)                 null,
    description            varchar(200)                 null,
    org_unit_path          varchar(500)                 null,
    parent_ou_id           varchar(200)                 null,
    content_sensitivity_id int                          null,
    account_id             varchar(255)                 not null,
    status_id              varchar(255)                 null,
    created_at             datetime                     null,
    created_by             int                          null,
    updated_at             datetime                     null,
    updated_by             int                          null,
    constraint google_org_unit_id
        unique (google_org_unit_id),
    constraint id
        unique (id)
);

create table plan
(
    id           char(36) collate utf8mb4_bin       not null
        primary key,
    name         varchar(255)                       not null,
    price        varchar(255)                       not null,
    price_id     varchar(255)                       not null,
    product_id   varchar(255)                       not null,
    tenure       enum ('YEAR', 'MONTH', 'FREE')     not null,
    currency     varchar(255)                       not null,
    trial_period int                                not null,
    plan_type    enum ('YEARLY', 'MONTHLY', 'FREE') not null,
    created_at   datetime                           not null,
    updated_at   datetime                           not null,
    deleted_at   datetime                           null,
    constraint price_id
        unique (price_id),
    constraint product_id
        unique (product_id)
);

create table prr_action
(
    id     varchar(50) not null
        primary key,
    action varchar(50) null
);

create table prr_level
(
    id    varchar(255) not null
        primary key,
    level varchar(20)  null
);

create table prr_trigger
(
    id        varchar(255) not null
        primary key,
    `trigger` varchar(20)  null
);

create table activity_ai_data
(
    id                bigint auto_increment
        primary key,
    web_url           varchar(250)                 not null,
    full_web_url      varchar(1000)                null,
    prr_images        longtext collate utf8mb4_bin null
        check (json_valid(`prr_images`)),
    prr_texts         longtext collate utf8mb4_bin null
        check (json_valid(`prr_texts`)),
    prr_trigger_id    varchar(255)                 null,
    prr_category_id   varchar(255)                 null,
    activity_time     datetime                     not null,
    false_positive    tinyint(1) default 0         not null,
    os                varchar(45)                  null,
    extension_version varchar(45)                  null,
    ml_version        varchar(45)                  null,
    nlp_version       varchar(45)                  null,
    browser_version   varchar(45)                  null,
    browser           varchar(45)                  null,
    created_at        datetime                     null,
    constraint activity_ai_data_ibfk_1
        foreign key (prr_trigger_id) references prr_trigger (id)
            on update cascade on delete set null,
    constraint activity_ai_data_ibfk_2
        foreign key (prr_category_id) references category (id)
            on update cascade on delete set null
);

create index prr_category_id
    on activity_ai_data (prr_category_id);

create index prr_trigger_id
    on activity_ai_data (prr_trigger_id);

create table role
(
    id   varchar(255) not null
        primary key,
    role varchar(50)  null,
    constraint id
        unique (id)
);

create table status
(
    id     varchar(255) not null
        primary key,
    status varchar(20)  not null
);

create table account
(
    id                       char(36) collate utf8mb4_bin not null
        primary key,
    name                     varchar(255)                 not null,
    status_id                varchar(255)                 null,
    account_type_id          varchar(255)                 null,
    primary_domain           varchar(255)                 not null,
    contact                  varchar(255)                 null,
    street_address           varchar(200)                 null,
    state                    varchar(15)                  null,
    city                     varchar(50)                  null,
    country                  varchar(255)                 null,
    email                    varchar(255)                 null,
    phone                    varchar(255)                 null,
    emergency_contact_name   varchar(255)                 null,
    emergency_contact_phone  varchar(255)                 null,
    interception_categories  longtext collate utf8mb4_bin null
        check (json_valid(`interception_categories`)),
    onboarding_status_id     varchar(255)                 null,
    on_boarding_step         int                          null,
    enable_extension         tinyint default 0            null,
    stripe_customer_id       varchar(255)                 null,
    notify_expired_extension tinyint default 0            null,
    created_at               datetime                     not null,
    updated_at               datetime                     not null,
    deleted_at               datetime                     null,
    constraint id
        unique (id),
    constraint primary_domain
        unique (primary_domain),
    constraint account_ibfk_1
        foreign key (status_id) references status (id)
            on update cascade on delete set null,
    constraint account_ibfk_2
        foreign key (account_type_id) references account_type (id)
            on update cascade on delete set null,
    constraint account_ibfk_3
        foreign key (onboarding_status_id) references status (id)
            on update cascade on delete set null
);

create index account_type_id
    on account (account_type_id);

create index onboarding_status_id
    on account (onboarding_status_id);

create index status_id
    on account (status_id);

create table account_license
(
    id         char(36) collate utf8mb4_bin not null
        primary key,
    `key`      varchar(200)                 not null,
    account_id char(36) collate utf8mb4_bin null,
    license_id varchar(255)                 null,
    enabled    tinyint(1) default 1         not null,
    expires_at datetime                     null,
    deleted_at datetime                     null,
    created_at datetime                     null,
    updated_at datetime                     null,
    constraint id
        unique (id),
    constraint `key`
        unique (`key`),
    constraint account_license_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade,
    constraint account_license_ibfk_2
        foreign key (license_id) references license (id)
            on update cascade
);

create index account_id
    on account_license (account_id);

create index license_id
    on account_license (license_id);

create table api_key
(
    id         char(36) collate utf8mb4_bin not null
        primary key,
    service    varchar(255)                 not null,
    host_url   varchar(300)                 null,
    access_key varchar(5000)                null,
    secret     varchar(5000)                null,
    account_id char(36) collate utf8mb4_bin not null,
    status_id  varchar(255)                 null,
    constraint service
        unique (service),
    constraint api_key_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade,
    constraint api_key_ibfk_2
        foreign key (status_id) references status (id)
            on update cascade on delete set null
);

create index account_id
    on api_key (account_id);

create index status_id
    on api_key (status_id);

create table device
(
    id               char(36) collate utf8mb4_bin not null
        primary key,
    name             varchar(200)                 null,
    os               varchar(45)                  null,
    schools_id       bigint                       null,
    device_id        varchar(100)                 null,
    serial_number    varchar(100)                 null,
    device_type_id   varchar(255)                 null,
    cpu_model        varchar(50)                  null,
    wifi_mac         varchar(45)                  null,
    ethernet_mac     varchar(45)                  null,
    imei             varchar(45)                  null,
    os_version       varchar(45)                  null,
    platform_version varchar(45)                  null,
    directory_api_id varchar(100)                 null,
    org_unit_id      char(36) collate utf8mb4_bin not null,
    status_id        varchar(255)                 null,
    account_id       char(36) collate utf8mb4_bin not null,
    created_at       datetime                     null,
    updated_at       datetime                     null,
    deleted_at       datetime                     null,
    constraint directory_api_id
        unique (directory_api_id),
    constraint id
        unique (id),
    constraint device_ibfk_1
        foreign key (org_unit_id) references organization_unit (id)
            on update cascade on delete cascade,
    constraint device_ibfk_2
        foreign key (status_id) references status (id)
            on update cascade on delete set null,
    constraint device_ibfk_3
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on device (account_id);

create index org_unit_id
    on device (org_unit_id);

create index status_id
    on device (status_id);

create table email_event_config
(
    id               bigint auto_increment
        primary key,
    account_id       char(36) collate utf8mb4_bin not null,
    event_type_id    varchar(50)                  not null,
    prr_action_id    varchar(50)                  null,
    enabled          tinyint default 1            not null,
    email_recipients varchar(1000)                null,
    constraint email_event_config_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade,
    constraint email_event_config_ibfk_2
        foreign key (event_type_id) references email_event_type (id)
            on update cascade,
    constraint email_event_config_ibfk_3
        foreign key (prr_action_id) references prr_action (id)
            on update cascade on delete set null
);

create index account_id
    on email_event_config (account_id);

create index event_type_id
    on email_event_config (event_type_id);

create index prr_action_id
    on email_event_config (prr_action_id);

create table filtered_category
(
    id            char(36) collate utf8mb4_bin not null
        primary key,
    name          varchar(40)                  not null,
    enabled       tinyint                      not null,
    category_id   varchar(255)                 not null,
    org_unit_id   char(36) collate utf8mb4_bin not null,
    account_id    char(36) collate utf8mb4_bin not null,
    status        varchar(50)                  not null,
    time_duration int                          null,
    constraint filtered_category_ibfk_1
        foreign key (category_id) references category (id)
            on update cascade,
    constraint filtered_category_ibfk_2
        foreign key (org_unit_id) references organization_unit (id)
            on update cascade,
    constraint filtered_category_ibfk_3
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on filtered_category (account_id);

create index category_id
    on filtered_category (category_id);

create index org_unit_id
    on filtered_category (org_unit_id);

create table filtered_process
(
    id          char(36) collate utf8mb4_bin not null
        primary key,
    name        varchar(150)                 not null,
    org_unit_id char(36) collate utf8mb4_bin null,
    account_id  char(36) collate utf8mb4_bin not null,
    is_allowed  tinyint(1) default 1         not null,
    createdAt   datetime                     not null,
    updatedAt   datetime                     not null,
    deletedAt   datetime                     null,
    constraint filtered_process_ibfk_1
        foreign key (org_unit_id) references organization_unit (id)
            on update cascade on delete set null,
    constraint filtered_process_ibfk_2
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on filtered_process (account_id);

create index org_unit_id
    on filtered_process (org_unit_id);

create table filtered_url
(
    id                  char(36) collate utf8mb4_bin not null
        primary key,
    url                 varchar(150)                 not null,
    org_unit_id         char(36) collate utf8mb4_bin null,
    account_id          char(36) collate utf8mb4_bin not null,
    enabled             tinyint(1) default 1         not null,
    inherit_from_parent tinyint(1) default 1         not null,
    constraint filtered_url_ibfk_1
        foreign key (org_unit_id) references organization_unit (id)
            on update cascade on delete set null,
    constraint filtered_url_ibfk_2
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on filtered_url (account_id);

create index org_unit_id
    on filtered_url (org_unit_id);

create table interception_time
(
    id                   int auto_increment
        primary key,
    school_start_time    time                         not null,
    school_end_time      time                         not null,
    lightsoff_start_time time                         not null,
    lightsoff_end_time   time                         not null,
    account_id           char(36) collate utf8mb4_bin not null,
    status_id            varchar(255)                 null,
    constraint interception_time_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade,
    constraint interception_time_ibfk_2
        foreign key (status_id) references status (id)
            on update cascade on delete set null
);

create index account_id
    on interception_time (account_id);

create index status_id
    on interception_time (status_id);

create table nonschool_day
(
    id         int auto_increment
        primary key,
    start_date date                          null,
    end_date   date                          null,
    title      varchar(100)                  null,
    type       varchar(50)                   null,
    account_id char(36) collate utf8mb4_bin  null,
    status_id  varchar(255) default 'ACTIVE' not null,
    constraint nonschool_day_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade on delete set null,
    constraint nonschool_day_ibfk_2
        foreign key (status_id) references status (id)
            on update cascade
);

create index account_id
    on nonschool_day (account_id);

create index status_id
    on nonschool_day (status_id);

create table nonschool_days_config
(
    account_id              char(36) collate utf8mb4_bin not null
        primary key,
    weekends_enabled        tinyint(1) default 1         not null,
    public_holidays_enabled tinyint(1) default 1         not null,
    created_at              datetime                     not null,
    updated_at              datetime                     not null,
    constraint nonschool_days_config_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade
);

create table payment
(
    id                char(36) collate utf8mb4_bin not null
        primary key,
    account_id        char(36) collate utf8mb4_bin not null,
    payment_method_id varchar(255)                 not null,
    last_digits       varchar(255)                 not null,
    expiry_month      int                          not null,
    expiry_year       int                          not null,
    created_at        datetime                     null,
    updated_at        datetime                     not null,
    deleted_at        datetime                     null,
    constraint payment_method_id
        unique (payment_method_id),
    constraint payment_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade on delete cascade
);

create index account_id
    on payment (account_id);

create table referral_promo_code
(
    id                 char(36) collate utf8mb4_bin not null
        primary key,
    code               varchar(8)                   not null,
    api_key            varchar(255)                 not null,
    coupon             varchar(255)                 not null,
    stripe_customer_id varchar(150)                 not null,
    expires_at         datetime                     null,
    active             tinyint(1) default 1         not null,
    account_id         char(36) collate utf8mb4_bin not null,
    created_by         varchar(255)                 null,
    updated_by         varchar(255)                 null,
    created_at         datetime                     null,
    updated_at         datetime                     null,
    times_redeemed     int                          not null,
    deleted_at         datetime                     null,
    constraint api_key
        unique (api_key),
    constraint code
        unique (code),
    constraint referral_promo_code_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on referral_promo_code (account_id);

create table roster_class
(
    id                 varchar(50)                  not null
        primary key,
    title              varchar(50)                  null,
    classType          varchar(50)                  null,
    location           varchar(45)                  null,
    grades             longtext collate utf8mb4_bin null
        check (json_valid(`grades`)),
    school_id          varchar(255)                 null,
    roster_status      varchar(255)                 null,
    date_last_modified datetime                     null,
    account_id         char(36) collate utf8mb4_bin not null,
    constraint id
        unique (id),
    constraint roster_class_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on roster_class (account_id);

create table roster_org
(
    id               varchar(255)                 not null
        primary key,
    name             varchar(255)                 not null,
    identifier       varchar(255)                 null,
    type             varchar(255)                 not null,
    dateLastModified varchar(255)                 null,
    roster_status    varchar(255)                 null,
    account_id       char(36) collate utf8mb4_bin not null,
    constraint id
        unique (id),
    constraint roster_org_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on roster_org (account_id);

create table subscription
(
    id                   char(36) collate utf8mb4_bin not null
        primary key,
    account_id           char(36) collate utf8mb4_bin not null,
    plan_id              char(36) collate utf8mb4_bin not null,
    trial_start_time     datetime                     not null,
    trial_end_time       datetime                     not null,
    trial_used           tinyint(1)                   not null,
    coupon               varchar(50)                  null,
    promotion_code       varchar(50)                  null,
    sub_start_time       datetime                     not null,
    sub_end_time         datetime                     not null,
    status               varchar(255)                 not null,
    cancel_at_period_end tinyint(1)                   null,
    created_at           datetime                     null,
    updated_at           datetime                     null,
    deleted_at           datetime                     null,
    constraint account_id
        unique (account_id),
    constraint subscription_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade,
    constraint subscription_ibfk_2
        foreign key (plan_id) references plan (id)
            on update cascade
);

create table invoice
(
    id                char(36) collate utf8mb4_bin not null
        primary key,
    account_id        char(36) collate utf8mb4_bin not null,
    subscription_id   char(36) collate utf8mb4_bin not null,
    next_payment_date datetime                     null,
    total_price       varchar(255)                 null,
    after_promo       varchar(255)                 null,
    amount_paid       varchar(255)                 null,
    amount_due        varchar(255)                 null,
    amount_remaining  varchar(255)                 null,
    createdAt         datetime                     not null,
    updatedAt         datetime                     not null,
    constraint account_id
        unique (account_id),
    constraint subscription_id
        unique (subscription_id),
    constraint invoice_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade,
    constraint invoice_ibfk_2
        foreign key (subscription_id) references subscription (id)
            on update cascade
);

create index plan_id
    on subscription (plan_id);

create table `subscription-feedback`
(
    id         char(36) collate utf8mb4_bin not null
        primary key,
    feedback   longtext collate utf8mb4_bin not null
        check (json_valid(`feedback`)),
    account_id char(36) collate utf8mb4_bin not null,
    created_at datetime                     null,
    updated_at datetime                     null,
    deleted_at datetime                     null,
    constraint `subscription-feedback_ibfk_1`
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on `subscription-feedback` (account_id);

create table url
(
    id   bigint auto_increment
        primary key,
    name varchar(150) not null,
    constraint name
        unique (name)
);

create table user
(
    id                   char(36) collate utf8mb4_bin   not null
        primary key,
    first_name           varchar(100)                   null,
    last_name            varchar(100)                   null,
    primary_email        varchar(150)                   not null,
    access_code          varchar(20)                    null,
    year_of_birth        varchar(4)                     null,
    password             varchar(100)                   null,
    user_name            varchar(100)                   null,
    enabled_user         tinyint(1)                     null,
    given_name           varchar(100)                   null,
    family_name          varchar(100)                   null,
    middle_name          varchar(100)                   null,
    identifier           varchar(100)                   null,
    roster_sourced_id    varchar(200)                   null,
    dateLastModified     varchar(255)                   null,
    roster_status        varchar(255)                   null,
    is_admin             tinyint      default 0         null,
    is_delegated_admin   tinyint      default 0         null,
    agreed_to_terms      tinyint      default 0         null,
    last_login_time      datetime                       null,
    recovery_email       varchar(100)                   null,
    recovery_phone       varchar(45)                    null,
    gender               varchar(45)                    null,
    archived             tinyint                        null,
    thumbnail_photo_etag varchar(100)                   null,
    thumbnail_photo_url  varchar(200)                   null,
    suspension_reason    varchar(45)                    null,
    phone                varchar(100)                   null,
    sms                  varchar(45)                    null,
    school_name          varchar(200)                   null,
    kind                 varchar(45)                    null,
    org_unit_path        varchar(200)                   null,
    org_unit_id          char(36) collate utf8mb4_bin   null,
    account_id           char(36) collate utf8mb4_bin   not null,
    cognito_id           varchar(50)                    null,
    role                 varchar(255) default 'STUDENT' not null,
    status_id            varchar(255)                   null,
    access_limited       tinyint(1)   default 0         null,
    google_user_id       varchar(100)                   null,
    created_at           datetime                       null,
    updated_at           datetime                       null,
    deleted_at           datetime                       null,
    update_by            varchar(45)                    null,
    created_by           varchar(45)                    null,
    constraint access_code
        unique (access_code),
    constraint google_user_id
        unique (google_user_id),
    constraint primary_email
        unique (primary_email),
    constraint roster_sourced_id
        unique (roster_sourced_id),
    constraint user_ibfk_1
        foreign key (org_unit_id) references organization_unit (id)
            on update cascade on delete set null,
    constraint user_ibfk_2
        foreign key (account_id) references account (id)
            on update cascade,
    constraint user_ibfk_3
        foreign key (role) references role (id)
            on update cascade,
    constraint user_ibfk_4
        foreign key (status_id) references status (id)
            on update cascade on delete set null
);

create table auth_token
(
    id            char(36) collate utf8mb4_bin not null
        primary key,
    access_token  varchar(5000)                null,
    refresh_token varchar(5000)                null,
    expires_at    datetime                     null,
    authenticator varchar(45)                  null,
    user_id       char(36) collate utf8mb4_bin not null,
    constraint user_id
        unique (user_id),
    constraint auth_token_ibfk_1
        foreign key (user_id) references user (id)
            on update cascade
);

create table enrollment
(
    id                 varchar(50)                  not null
        primary key,
    user_sourced_id    varchar(255)                 null,
    `primary`          tinyint default 0            null,
    begin_date         datetime                     null,
    end_date           datetime                     null,
    class_id           varchar(255)                 null,
    role               varchar(255)                 null,
    school_id          varchar(255)                 null,
    roster_status      varchar(255)                 null,
    date_last_modified datetime                     null,
    account_id         char(36) collate utf8mb4_bin not null,
    constraint id
        unique (id),
    constraint enrollment_ibfk_1
        foreign key (user_sourced_id) references user (roster_sourced_id)
            on update cascade on delete set null,
    constraint enrollment_ibfk_2
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on enrollment (account_id);

create index user_sourced_id
    on enrollment (user_sourced_id);

create table jobs
(
    id         char(36) collate utf8mb4_bin not null
        primary key,
    remarks    varchar(255)                 null,
    status     varchar(255)                 not null,
    type       varchar(255)                 not null,
    start_date datetime                     null,
    end_date   datetime                     null,
    user_id    char(36) collate utf8mb4_bin not null,
    account_id char(36) collate utf8mb4_bin not null,
    constraint id
        unique (id),
    constraint jobs_ibfk_1
        foreign key (user_id) references user (id)
            on update cascade,
    constraint jobs_ibfk_2
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on jobs (account_id);

create index user_id
    on jobs (user_id);

create table kid_config
(
    id                          char(36) collate utf8mb4_bin not null
        primary key,
    off_time                    varchar(50)                  null,
    user_id                     char(36) collate utf8mb4_bin not null,
    status                      varchar(255)                 null,
    step                        int                          null,
    extension_status            varchar(255)                 null,
    extension_status_updated_at datetime                     null,
    access_limited_at           datetime                     null,
    constraint kid_config_ibfk_1
        foreign key (user_id) references user (id)
            on update cascade,
    constraint kid_config_ibfk_2
        foreign key (status) references status (id)
            on update cascade on delete set null
);

create index status
    on kid_config (status);

create index user_id
    on kid_config (user_id);

create table kid_request
(
    id                  char(36) collate utf8mb4_bin                   not null
        primary key,
    url                 varchar(500)                                   not null,
    category_id         varchar(50)                                    not null,
    access_granted      tinyint(1) default 0                           not null,
    type                enum ('ASK', 'INFORM_AI', 'INFORM', 'PREVENT') null,
    request_time        datetime                                       null,
    user_device_link_id char(36) collate utf8mb4_bin                   null,
    kid_id              char(36) collate utf8mb4_bin                   null,
    user_id             char(36) collate utf8mb4_bin                   null,
    updatedAt           datetime                                       null,
    createdAt           datetime                                       not null,
    constraint kid_request_ibfk_1
        foreign key (category_id) references category (id)
            on update cascade,
    constraint kid_request_ibfk_2
        foreign key (kid_id) references user (id)
            on update cascade on delete set null,
    constraint kid_request_ibfk_3
        foreign key (user_id) references user (id)
            on update cascade on delete set null
);

create index category_id
    on kid_request (category_id);

create index kid_id
    on kid_request (kid_id);

create index user_id
    on kid_request (user_id);

create table non_school_devices_config
(
    id         char(36) collate utf8mb4_bin not null
        primary key,
    account_id char(36) collate utf8mb4_bin not null,
    email      varchar(255)                 not null,
    constraint id
        unique (id),
    constraint non_school_devices_config_ibfk_1
        foreign key (account_id) references account (id)
            on update cascade,
    constraint non_school_devices_config_ibfk_2
        foreign key (email) references user (primary_email)
            on update cascade
);

create index account_id
    on non_school_devices_config (account_id);

create index email
    on non_school_devices_config (email);

create table parent_consent
(
    id                             char(36) collate utf8mb4_bin not null
        primary key,
    user_id                        char(36) collate utf8mb4_bin not null,
    account_id                     char(36) collate utf8mb4_bin not null,
    has_legal_authority_to_install tinyint(1)                   not null,
    bound_by_privacy_policy        tinyint(1)                   not null,
    createdAt                      datetime                     not null,
    updatedAt                      datetime                     not null,
    deletedAt                      datetime                     null,
    constraint parent_consent_ibfk_1
        foreign key (user_id) references user (id)
            on update cascade,
    constraint parent_consent_ibfk_2
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on parent_consent (account_id);

create index user_id
    on parent_consent (user_id);

create index account_id
    on user (account_id);

create index org_unit_id
    on user (org_unit_id);

create index role
    on user (role);

create index status_id
    on user (status_id);

create table user_code
(
    id        char(36) collate utf8mb4_bin      not null
        primary key,
    user_id   char(36) collate utf8mb4_bin      not null,
    code_type enum ('EMAIL', 'PASSWORD', 'SMS') not null,
    code      varchar(255)                      not null,
    createdAt datetime                          not null,
    updatedAt datetime                          not null,
    deletedAt datetime                          null,
    constraint user_code_ibfk_1
        foreign key (user_id) references user (id)
            on update cascade on delete cascade
);

create index user_id
    on user_code (user_id);

create table user_device_link
(
    id             char(36) collate utf8mb4_bin           not null
        primary key,
    device_id      char(36) collate utf8mb4_bin           null,
    user_id        char(36) collate utf8mb4_bin           null,
    login_time     datetime default '2024-04-25 17:53:13' null,
    last_activity  datetime                               null comment 'not required, we can get from activity table',
    status         varchar(20)                            null,
    provision_date datetime default '2024-04-25 17:53:13' null,
    created_at     datetime                               null,
    updated_at     datetime                               null,
    deleted_at     datetime                               null,
    constraint id
        unique (id),
    constraint user_device_link_ibfk_1
        foreign key (device_id) references device (id)
            on update cascade,
    constraint user_device_link_ibfk_2
        foreign key (user_id) references user (id)
            on update cascade
);

create table activity
(
    id                   bigint auto_increment
        primary key,
    user_email           varchar(100)                 not null,
    user_name            varchar(100)                 not null,
    teacher_name         varchar(100)                 null,
    activity_time        datetime                     not null,
    prr_images           longtext collate utf8mb4_bin null
        check (json_valid(`prr_images`)),
    prr_texts            longtext collate utf8mb4_bin null
        check (json_valid(`prr_texts`)),
    prr_messages         longtext collate utf8mb4_bin null comment 'array of messages and responses by user'
        check (json_valid(`prr_messages`)),
    prr_level_id         varchar(255)                 null,
    prr_trigger_id       varchar(255)                 null,
    prr_category_id      varchar(255)                 null,
    prr_activity_type_id varchar(30)                  null,
    web_activity_type_id varchar(30)                  null,
    web_url              varchar(250)                 not null,
    web_title            varchar(100)                 null,
    full_web_url         varchar(1000)                null,
    device_mac_address   varchar(50)                  null,
    device_ip_address    varchar(50)                  null,
    device_public_wan    varchar(50)                  null,
    access_limited       tinyint                      null,
    location             varchar(45)                  null,
    app_name             varchar(45)                  null,
    os                   varchar(45)                  null,
    extension_version    varchar(45)                  null,
    ml_version           varchar(45)                  null,
    nlp_version          varchar(45)                  null,
    browser_version      varchar(45)                  null,
    browser              varchar(45)                  null,
    ip                   varchar(45)                  null,
    web_category_id      varchar(255)                 null,
    event_id             varchar(50)                  null,
    status_id            varchar(255)                 null,
    is_offday            tinyint(1)                   null,
    is_offtime           tinyint(1)                   null,
    school_name          varchar(100)                 null,
    user_id              char(36) collate utf8mb4_bin null,
    teacher_id           char(36) collate utf8mb4_bin null,
    user_device_link_id  char(36) collate utf8mb4_bin null,
    org_unit_id          char(36) collate utf8mb4_bin null,
    account_id           char(36) collate utf8mb4_bin not null,
    created_at           datetime                     null,
    constraint event_id
        unique (event_id),
    constraint activity_ibfk_1
        foreign key (prr_level_id) references prr_level (id)
            on update cascade on delete set null,
    constraint activity_ibfk_10
        foreign key (user_device_link_id) references user_device_link (id)
            on update cascade on delete set null,
    constraint activity_ibfk_11
        foreign key (org_unit_id) references organization_unit (id)
            on update cascade on delete set null,
    constraint activity_ibfk_12
        foreign key (account_id) references account (id)
            on update cascade,
    constraint activity_ibfk_2
        foreign key (prr_trigger_id) references prr_trigger (id)
            on update cascade on delete set null,
    constraint activity_ibfk_3
        foreign key (prr_category_id) references category (id)
            on update cascade on delete set null,
    constraint activity_ibfk_4
        foreign key (prr_activity_type_id) references activity_type (id)
            on update cascade on delete set null,
    constraint activity_ibfk_5
        foreign key (web_activity_type_id) references activity_type (id)
            on update cascade on delete set null,
    constraint activity_ibfk_6
        foreign key (web_category_id) references category (id)
            on update cascade on delete set null,
    constraint activity_ibfk_7
        foreign key (status_id) references status (id)
            on update cascade on delete set null,
    constraint activity_ibfk_8
        foreign key (user_id) references user (id)
            on update cascade on delete set null,
    constraint activity_ibfk_9
        foreign key (teacher_id) references user (id)
            on update cascade on delete set null
);

create index account_id
    on activity (account_id);

create index org_unit_id
    on activity (org_unit_id);

create index prr_activity_type_id
    on activity (prr_activity_type_id);

create index prr_category_id
    on activity (prr_category_id);

create index prr_level_id
    on activity (prr_level_id);

create index prr_trigger_id
    on activity (prr_trigger_id);

create index status_id
    on activity (status_id);

create index teacher_id
    on activity (teacher_id);

create index user_device_link_id
    on activity (user_device_link_id);

create index user_id
    on activity (user_id);

create index web_activity_type_id
    on activity (web_activity_type_id);

create index web_category_id
    on activity (web_category_id);

create table email_event
(
    id                  bigint auto_increment
        primary key,
    google_user_id      varchar(100)                 null,
    user_id             char(36) collate utf8mb4_bin null,
    event_type_id       varchar(50)                  not null,
    event_time          datetime                     not null,
    thread_id           varchar(255)                 null,
    message_id          varchar(255)                 null,
    user_flag           varchar(255)                 null,
    ml_flag             varchar(255)                 null,
    ml_category_id      varchar(255)                 null,
    prr_triggered       tinyint(1)                   null,
    prr_message         varchar(255)                 null,
    prr_action_id       varchar(50)                  null,
    from_name           varchar(500)                 null,
    from_email          varchar(500)                 null,
    to_name             varchar(500)                 null,
    to_email            varchar(500)                 null,
    subject             text                         null,
    body                text                         null,
    ml_version          varchar(255)                 null,
    browser             varchar(255)                 null,
    browser_version     varchar(255)                 null,
    extension_version   varchar(255)                 null,
    platform            varchar(255)                 null,
    user_device_link_id char(36) collate utf8mb4_bin null,
    org_unit_id         char(36) collate utf8mb4_bin null,
    account_id          char(36) collate utf8mb4_bin not null,
    created_at          datetime                     null,
    constraint email_event_ibfk_1
        foreign key (user_id) references user (id)
            on update cascade on delete set null,
    constraint email_event_ibfk_2
        foreign key (event_type_id) references email_event_type (id)
            on update cascade,
    constraint email_event_ibfk_3
        foreign key (ml_category_id) references category (id)
            on update cascade on delete set null,
    constraint email_event_ibfk_4
        foreign key (prr_action_id) references prr_action (id)
            on update cascade on delete set null,
    constraint email_event_ibfk_5
        foreign key (user_device_link_id) references user_device_link (id)
            on update cascade on delete set null,
    constraint email_event_ibfk_6
        foreign key (org_unit_id) references organization_unit (id)
            on update cascade on delete set null,
    constraint email_event_ibfk_7
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on email_event (account_id);

create index event_type_id
    on email_event (event_type_id);

create index ml_category_id
    on email_event (ml_category_id);

create index org_unit_id
    on email_event (org_unit_id);

create index prr_action_id
    on email_event (prr_action_id);

create index user_device_link_id
    on email_event (user_device_link_id);

create index user_id
    on email_event (user_id);

create table feedback
(
    id                  bigint auto_increment
        primary key,
    type                varchar(255)                 null,
    web_url             varchar(300)                 null,
    prr_trigger_id      varchar(255)                 null,
    prr_category_id     varchar(255)                 null,
    prr_images          longtext collate utf8mb4_bin null
        check (json_valid(`prr_images`)),
    prr_texts           longtext collate utf8mb4_bin null
        check (json_valid(`prr_texts`)),
    account_id          char(36) collate utf8mb4_bin not null,
    user_device_link_id char(36) collate utf8mb4_bin not null,
    constraint feedback_ibfk_1
        foreign key (prr_trigger_id) references prr_trigger (id)
            on update cascade on delete set null,
    constraint feedback_ibfk_2
        foreign key (prr_category_id) references category (id)
            on update cascade on delete set null,
    constraint feedback_ibfk_3
        foreign key (account_id) references account (id)
            on update cascade,
    constraint feedback_ibfk_4
        foreign key (user_device_link_id) references user_device_link (id)
            on update cascade
);

create index account_id
    on feedback (account_id);

create index prr_category_id
    on feedback (prr_category_id);

create index prr_trigger_id
    on feedback (prr_trigger_id);

create index user_device_link_id
    on feedback (user_device_link_id);

create table inform_prr_visit
(
    id          bigint auto_increment
        primary key,
    activity_id bigint        not null,
    visit_time  datetime      not null,
    url         varchar(1000) not null,
    created_at  datetime      null,
    constraint inform_prr_visit_ibfk_1
        foreign key (activity_id) references activity (id)
            on update cascade
);

create index activity_id
    on inform_prr_visit (activity_id);

create table prr_notification
(
    id           char(36) collate utf8mb4_bin not null
        primary key,
    activity_id  bigint                       not null,
    url          varchar(300)                 not null,
    `read`       tinyint(1) default 0         not null,
    read_at      datetime                     null,
    contact      varchar(255)                 not null,
    phone_number varchar(255)                 null,
    expired      tinyint(1) default 0         not null,
    expired_at   datetime                     null,
    expiry_date  datetime                     null,
    account_id   char(36) collate utf8mb4_bin not null,
    createdAt    datetime                     not null,
    updatedAt    datetime                     not null,
    deletedAt    datetime                     null,
    constraint prr_notification_ibfk_1
        foreign key (activity_id) references activity (id)
            on update cascade,
    constraint prr_notification_ibfk_2
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on prr_notification (account_id);

create index activity_id
    on prr_notification (activity_id);

create index device_id
    on user_device_link (device_id);

create index user_id
    on user_device_link (user_id);

create table user_opt_in
(
    user_id           char(36) collate utf8mb4_bin not null
        primary key,
    email_opt_in      tinyint(1)                   null,
    email_opt_in_time datetime                     null,
    onboarding_done   tinyint(1)                   null,
    onboarding_time   datetime                     null,
    created_at        datetime                     null,
    updated_at        datetime                     null
);

create table web_time
(
    id                  bigint auto_increment
        primary key,
    user_email          varchar(150)                 null,
    user_id             char(36) collate utf8mb4_bin null,
    full_url            varchar(45)                  null,
    host_name           varchar(45)                  null,
    visited_at          datetime                     null,
    duration            int                          null,
    device_id           char(36) collate utf8mb4_bin null,
    user_devices_id     char(36) collate utf8mb4_bin null,
    device_mac_address  varchar(100)                 null,
    device_ip_address   varchar(50)                  null,
    device_public_wan   varchar(50)                  null,
    extension_version   varchar(45)                  null,
    browser_version     varchar(45)                  null,
    browser             varchar(45)                  null,
    ml_version          varchar(45)                  null,
    nlp_version         varchar(45)                  null,
    ip                  varchar(45)                  null,
    location            varchar(45)                  null,
    user_device_link_id char(36) collate utf8mb4_bin null,
    org_unit_id         char(36) collate utf8mb4_bin null,
    account_id          char(36) collate utf8mb4_bin not null,
    constraint web_time_ibfk_1
        foreign key (user_id) references user (id)
            on update cascade on delete set null,
    constraint web_time_ibfk_2
        foreign key (user_device_link_id) references user_device_link (id)
            on update cascade on delete set null,
    constraint web_time_ibfk_3
        foreign key (org_unit_id) references organization_unit (id)
            on update cascade on delete set null,
    constraint web_time_ibfk_4
        foreign key (account_id) references account (id)
            on update cascade
);

create index account_id
    on web_time (account_id);

create index org_unit_id
    on web_time (org_unit_id);

create index user_device_link_id
    on web_time (user_device_link_id);

create index user_id
    on web_time (user_id);

CREATE TABLE web_category_url (
  url VARCHAR(255) NOT NULL,
  meta JSON NOT NULL,
  source VARCHAR(255) NOT NULL,
  category JSON NOT NULL,
  probability JSON NULL,
  ai_generated BOOLEAN DEFAULT NULL,
  verified BOOLEAN DEFAULT NULL,
  wrong_category BOOLEAN DEFAULT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME DEFAULT NULL,
  created_by VARCHAR(45) DEFAULT NULL,
  updated_by VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (url)
);

CREATE TABLE web_category_host (
  host VARCHAR(255) NOT NULL,
  category JSON NOT NULL,
  wrong_category BOOLEAN DEFAULT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  deleted_at DATETIME DEFAULT NULL,
  created_by VARCHAR(45) DEFAULT NULL,
  updated_by VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (host)
);
