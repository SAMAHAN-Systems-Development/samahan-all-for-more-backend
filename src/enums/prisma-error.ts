/**
 * Enum for Prisma error codes.
 * @see https://www.prisma.io/docs/orm/reference/error-reference
 */
export enum PrismaErrorCode {
  // Common

  /**
   * Authentication failed against database server.
   * The provided database credentials are not valid.
   */
  AuthenticationFailed = 'P1000',

  /**
   * Can't reach database server.
   * Please make sure your database server is running.
   */
  CannotReachDatabaseServer = 'P1001',

  /**
   * The database server was reached but timed out.
   * Please try again and ensure your database server is running.
   */
  DatabaseServerTimedOut = 'P1002',

  /**
   * Database file does not exist at the specified path.
   */
  DatabaseFileNotFound = 'P1003',

  /**
   * Database does not exist on the database server.
   */
  DatabaseNotFound = 'P1003',

  /**
   * Operations timed out after a specified time.
   */
  OperationsTimedOut = 'P1008',

  /**
   * Database already exists on the database server.
   */
  DatabaseAlreadyExists = 'P1009',

  /**
   * User was denied access on the database.
   */
  UserDeniedAccess = 'P1010',

  /**
   * Error opening a TLS connection.
   */
  TlsConnectionError = 'P1011',

  /**
   * Schema validation error.
   * See the version 4.0.0 upgrade guide for more details.
   */
  SchemaValidationError = 'P1012',

  /**
   * The provided database string is invalid.
   */
  InvalidDatabaseString = 'P1013',

  /**
   * The underlying model for the specified model does not exist.
   */
  UnderlyingModelNotFound = 'P1014',

  /**
   * Your Prisma schema is using features that are not supported for the version of the database.
   */
  UnsupportedSchemaFeatures = 'P1015',

  /**
   * Your raw query had an incorrect number of parameters.
   */
  IncorrectNumberOfParameters = 'P1016',

  /**
   * Server has closed the connection.
   */
  ServerClosedConnection = 'P1017',

  // Prisma Client (Query Engine)

  /**
   * The provided value for the column is too long for the column's type.
   */
  ColumnValueTooLong = 'P2000',

  /**
   * The record searched for in the where condition does not exist.
   */
  RecordNotFound = 'P2001',

  /**
   * Unique constraint failed on the specified constraint.
   */
  UniqueConstraintViolation = 'P2002',

  /**
   * Foreign key constraint failed on the specified field.
   */
  ForeignKeyConstraintViolation = 'P2003',

  /**
   * A constraint failed on the database.
   */
  DatabaseConstraintViolation = 'P2004',

  /**
   * The value stored in the database for the field is invalid for the field's type.
   */
  InvalidFieldValue = 'P2005',

  /**
   * The provided value for the model field is not valid.
   */
  InvalidModelFieldValue = 'P2006',

  /**
   * Data validation error.
   */
  DataValidationError = 'P2007',

  /**
   * Failed to parse the query at the specified position.
   */
  QueryParsingError = 'P2008',

  /**
   * Failed to validate the query at the specified position.
   */
  QueryValidationError = 'P2009',

  /**
   * Raw query failed with the specified code and message.
   */
  RawQueryFailed = 'P2010',

  /**
   * Null constraint violation on the specified constraint.
   */
  NullConstraintViolation = 'P2011',

  /**
   * Missing a required value at the specified path.
   */
  MissingRequiredValue = 'P2012',

  /**
   * Missing the required argument for the specified field on the specified object.
   */
  MissingRequiredArgument = 'P2013',

  /**
   * The change you are trying to make would violate the required relation between the specified models.
   */
  RequiredRelationViolation = 'P2014',

  /**
   * A related record could not be found.
   */
  RelatedRecordNotFound = 'P2015',

  /**
   * Query interpretation error.
   */
  QueryInterpretationError = 'P2016',

  /**
   * The records for relation between the specified models are not connected.
   */
  RelationRecordsNotConnected = 'P2017',

  /**
   * The required connected records were not found.
   */
  RequiredConnectedRecordsNotFound = 'P2018',

  /**
   * Input error.
   */
  InputError = 'P2019',

  /**
   * Value out of range for the type.
   */
  ValueOutOfRange = 'P2020',

  /**
   * The table does not exist in the current database.
   */
  TableNotFound = 'P2021',

  /**
   * The column does not exist in the current database.
   */
  ColumnNotFound = 'P2022',

  /**
   * Inconsistent column data.
   */
  InconsistentColumnData = 'P2023',

  /**
   * Timed out fetching a new connection from the connection pool.
   */
  ConnectionPoolTimeout = 'P2024',

  /**
   * An operation failed because it depends on one or more records that were required but not found.
   */
  OperationFailedDueToMissingRecords = 'P2025',

  /**
   * The current database provider doesn't support a feature that the query used.
   */
  UnsupportedDatabaseFeature = 'P2026',

  /**
   * Multiple errors occurred on the database during query execution.
   */
  MultipleDatabaseErrors = 'P2027',

  /**
   * Transaction API error.
   */
  TransactionApiError = 'P2028',

  /**
   * Query parameter limit exceeded error.
   */
  QueryParameterLimitExceeded = 'P2029',

  /**
   * Cannot find a fulltext index to use for the search.
   */
  FulltextIndexNotFound = 'P2030',

  /**
   * Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set.
   */
  MongoDbReplicaSetRequired = 'P2031',

  /**
   * A number used in the query does not fit into a 64-bit signed integer.
   */
  NumberTooLarge = 'P2033',

  /**
   * Transaction failed due to a write conflict or a deadlock.
   */
  TransactionWriteConflict = 'P2034',

  /**
   * Assertion violation on the database.
   */
  DatabaseAssertionViolation = 'P2035',

  /**
   * Error in external connector.
   */
  ExternalConnectorError = 'P2036',

  /**
   * Too many database connections opened.
   */
  TooManyDatabaseConnections = 'P2037',

  // Prisma Migrate (Schema Engine)

  /**
   * Failed to create database.
   */
  FailedToCreateDatabase = 'P3000',

  /**
   * Migration possible with destructive changes and possible data loss.
   */
  MigrationWithDestructiveChanges = 'P3001',

  /**
   * The attempted migration was rolled back.
   */
  MigrationRolledBack = 'P3002',

  /**
   * The format of migrations changed, the saved migrations are no longer valid.
   */
  InvalidMigrationFormat = 'P3003',

  /**
   * The database is a system database and should not be altered with Prisma Migrate.
   */
  SystemDatabaseAlteration = 'P3004',

  /**
   * The database schema is not empty.
   */
  NonEmptyDatabaseSchema = 'P3005',

  /**
   * Migration failed to apply cleanly to the shadow database.
   */
  ShadowDatabaseMigrationFailed = 'P3006',

  /**
   * Some of the requested preview features are not yet allowed in the schema engine.
   */
  PreviewFeaturesNotAllowed = 'P3007',

  /**
   * The migration is already recorded as applied in the database.
   */
  MigrationAlreadyApplied = 'P3008',

  /**
   * Failed migrations found in the target database.
   */
  FailedMigrationsFound = 'P3009',

  /**
   * The name of the migration is too long.
   */
  MigrationNameTooLong = 'P3010',

  /**
   * Migration cannot be rolled back because it was never applied to the database.
   */
  MigrationNotApplied = 'P3011',

  /**
   * Migration cannot be rolled back because it is not in a failed state.
   */
  MigrationNotInFailedState = 'P3012',

  /**
   * Datasource provider arrays are no longer supported in Prisma Migrate.
   */
  DatasourceProviderArrayNotSupported = 'P3013',

  /**
   * Prisma Migrate could not create the shadow database.
   */
  ShadowDatabaseCreationFailed = 'P3014',

  /**
   * Could not find the migration file at the specified path.
   */
  MigrationFileNotFound = 'P3015',

  /**
   * The fallback method for database resets failed.
   */
  FallbackDatabaseResetFailed = 'P3016',

  /**
   * The migration could not be found.
   */
  MigrationNotFound = 'P3017',

  /**
   * A migration failed to apply.
   */
  MigrationFailedToApply = 'P3018',

  /**
   * The datasource provider specified in your schema does not match the one specified in the migration_lock.toml.
   */
  DatasourceProviderMismatch = 'P3019',

  /**
   * The automatic creation of shadow databases is disabled on Azure SQL.
   */
  AzureSqlShadowDatabaseDisabled = 'P3020',

  /**
   * Foreign keys cannot be created on this database.
   */
  ForeignKeysNotSupported = 'P3021',

  /**
   * Direct execution of DDL (Data Definition Language) SQL statements is disabled on this database.
   */
  DirectDdlExecutionDisabled = 'P3022',

  // Prisma db pull

  /**
   * Introspection operation failed to produce a schema file.
   */
  IntrospectionFailed = 'P4000',

  /**
   * The introspected database was empty.
   */
  EmptyIntrospectedDatabase = 'P4001',

  /**
   * The schema of the introspected database was inconsistent.
   */
  InconsistentIntrospectedDatabaseSchema = 'P4002',

  // Prisma Accelerate

  /**
   * Generic error to catch all other errors.
   */
  AccelerateServerError = 'P6000',

  /**
   * The URL is malformed; for instance, it does not use the prisma:// protocol.
   */
  InvalidDataSource = 'P6001',

  /**
   * The API Key in the connection string is invalid.
   */
  UnauthorizedApiKey = 'P6002',

  /**
   * The included usage of the current plan has been exceeded.
   */
  PlanLimitReached = 'P6003',

  /**
   * The global timeout of Accelerate has been exceeded.
   */
  QueryTimeout = 'P6004',

  /**
   * The user supplied invalid parameters.
   */
  InvalidParameters = 'P6005',

  /**
   * The chosen Prisma version is not compatible with Accelerate.
   */
  VersionNotSupported = 'P6006',

  /**
   * The engine failed to start.
   */
  EngineStartError = 'P6008',

  /**
   * The global response size limit of Accelerate has been exceeded.
   */
  ResponseSizeLimitExceeded = 'P6009',

  /**
   * Your accelerate project is disabled.
   */
  ProjectDisabled = 'P6010',

  // Prisma Pulse

  /**
   * An unexpected server error occurred.
   * This can happen due to a technical issue within Prisma Pulse or its infrastructure.
   */
  PulseServerError = 'P6100',

  /**
   * The datasource is not reachable by Prisma Pulse.
   * The datasource may become unavailable after the configuration step.
   */
  PulseDatasourceError = 'P6101',

  /**
   * The API key is invalid.
   */
  PulseUnauthorized = 'P6102',

  /**
   * Prisma Pulse is not enabled for the configured API key.
   */
  PulseProjectDisabled = 'P6103',

  /**
   * Your Prisma Data Platform account has been blocked, potentially due to exceeding the usage limit included in your current plan.
   */
  PulseAccountHold = 'P6104',

  /**
   * The Prisma version of the project is not compatible with Prisma Pulse.
   */
  PulseVersionNotSupported = 'P6105',
}
