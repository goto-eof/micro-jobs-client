export default class JobConst {
  static readonly TYPE_OFFER = 0;
  static readonly TYPE_REQUEST = 1;

  static readonly SCOPE_PUBLIC = 'public';
  static readonly SCOPE_PRIVATE = 'private';

  static readonly STATUS_CREATED = 0;
  static readonly STATUS_UPDATED = 1;
  static readonly STATUS_UNPUBLISHED = 2;
  static readonly STATUS_PUBLISHED = 10;
}
