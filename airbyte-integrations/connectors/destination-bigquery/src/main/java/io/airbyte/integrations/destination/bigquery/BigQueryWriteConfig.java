/*
 * Copyright (c) 2022 Airbyte, Inc., all rights reserved.
 */

package io.airbyte.integrations.destination.bigquery;

import com.google.cloud.bigquery.Schema;
import com.google.cloud.bigquery.TableId;
import io.airbyte.protocol.models.v0.DestinationSyncMode;
import java.util.ArrayList;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * @param datasetId the dataset ID is equivalent to output schema
 */
public record BigQueryWriteConfig(
                                  String streamName,
                                  String namespace,
                                  String datasetId,
                                  String datasetLocation,
                                  TableId tmpTableId,
                                  TableId targetTableId,
                                  Schema tableSchema,
                                  DestinationSyncMode syncMode,
                                  List<String> stagedFiles) {

  private static final Logger LOGGER = LoggerFactory.getLogger(BigQueryWriteConfig.class);

  public BigQueryWriteConfig(final String streamName,
                             final String namespace,
                             final String datasetId,
                             final String datasetLocation,
                             final String tmpTableName,
                             final String targetTableName,
                             final Schema tableSchema,
                             final DestinationSyncMode syncMode) {
    this(
        streamName,
        namespace,
        datasetId,
        datasetLocation,
        TableId.of(datasetId, tmpTableName),
        TableId.of(datasetId, targetTableName),
        tableSchema,
        syncMode,
        new ArrayList<>());
  }

  public void addStagedFile(final String file) {
    this.stagedFiles.add(file);
    LOGGER.info("Added staged file: {}", file);
  }

  public void clearStagedFiles() {
    this.stagedFiles.clear();
  }

}
