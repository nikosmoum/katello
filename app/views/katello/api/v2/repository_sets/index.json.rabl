object false
extends "katello/api/v2/common/metadata"

child @collection[:results] => :results do
  extends 'katello/api/v2/repository_sets/show'
end
