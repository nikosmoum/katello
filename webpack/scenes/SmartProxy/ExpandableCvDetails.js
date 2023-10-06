import React from 'react';
import PropTypes from 'prop-types';
import { translate as __ } from 'foremanReact/common/I18n';
import { TableComposable, Thead, Tr, Th, Tbody, Td } from '@patternfly/react-table';
import { CheckCircleIcon, TimesCircleIcon } from '@patternfly/react-icons';
import LongDateTime from 'foremanReact/components/common/dates/LongDateTime';
import { urlBuilder } from 'foremanReact/common/urlHelpers';
import ContentViewIcon from '../ContentViews/components/ContentViewIcon';
import { useSet } from '../../components/Table/TableHooks';
import ExpandedSmartProxyRepositories from './ExpandedSmartProxyRepositories';

const ExpandableCvDetails = ({ contentViews, counts }) => {
  const columnHeaders = [
    __('Content view'),
    __('Last published'),
    __('Synced to smart proxy'),
  ];
  const { content_counts: contentCounts } = counts;
  const expandedTableRows = useSet([]);
  const tableRowIsExpanded = id => expandedTableRows.has(id);

  return (
    <TableComposable
      aria-label="expandable-content-views"
      ouiaId="expandable-content-views"
    >
      <Thead>
        <Tr ouiaId="column-headers">
          <Th />
          {columnHeaders.map(col => (
            <Th
              key={col}
            >
              {col}
            </Th>
          ))}
        </Tr>
      </Thead>
      {contentViews.map((cv, rowIndex) => {
        const {
          id, name: cvName, composite, up_to_date: upToDate, cvv_id: version, repositories,
        } = cv;
        const upToDateVal = upToDate ? <CheckCircleIcon /> : <TimesCircleIcon />;
        const isExpanded = tableRowIsExpanded(version);
        return (
          <Tbody key={`${id} + ${version}`}isExpanded={isExpanded}>
            <Tr key={version} ouiaId={cv.name}>
              <Td
                expand={{
                  rowIndex,
                  isExpanded,
                  onToggle: (_event, _rInx, isOpen) => expandedTableRows.onToggle(isOpen, version),
                }}
              />
              <Td>
                <ContentViewIcon
                  composite={composite}
                  description={<a href={cv.default ? urlBuilder('products', '') : urlBuilder('content_views', '', id)}>{cvName}</a>}
                />
              </Td>
              <Td><LongDateTime date={cv.last_published} showRelativeTimeTooltip /></Td>
              <Td>{upToDateVal}</Td>
            </Tr>
            <Tr key="child_row" ouiaId={`ContentViewTableRowChild-${id}`} isExpanded={isExpanded}>
              <Td colSpan={12}>
                <ExpandedSmartProxyRepositories
                  contentCounts={contentCounts?.content_view_versions[version]?.repositories}
                  repositories={repositories}
                />
              </Td>
            </Tr>
          </Tbody>
        );
      })}

    </TableComposable>

  );
};

ExpandableCvDetails.propTypes = {
  contentViews: PropTypes.arrayOf(PropTypes.shape({})),
  counts: PropTypes.shape({
    content_counts: PropTypes.shape({
      content_view_versions: PropTypes.shape({}),
    }),
  }),
};

ExpandableCvDetails.defaultProps = {
  contentViews: [],
  counts: {},
};

export default ExpandableCvDetails;
